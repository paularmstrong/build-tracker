/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import BuildDelta from './BuildDelta';
import markdownTable from 'markdown-table';
import { ArtifactBudgets, ArtifactFilters, BudgetResult, Group } from '@build-tracker/types';
import { formatBytes, formatSha } from '@build-tracker/formatting';

export interface ArtifactSizes {
  [key: string]: number;
}

export enum CellType {
  TEXT = 'text',
  DELTA = 'delta',
  TOTAL = 'total',
  TOTAL_DELTA = 'totalDelta',
  REVISION = 'revision',
  REVISION_DELTA = 'revisionDelta',
  ARTIFACT = 'artifact',
  GROUP = 'group'
}

export interface TextCell {
  type: CellType.TEXT;
  text: string;
}

export interface DeltaCell {
  type: CellType.DELTA;
  name: string;
  sizes: ArtifactSizes;
  percents: ArtifactSizes;
  hashChanged: boolean;
  budgets: Array<BudgetResult>;
  failingBudgets: Array<BudgetResult>;
}

export interface TotalCell {
  type: CellType.TOTAL;
  name: string;
  sizes: ArtifactSizes;
}

export interface TotalDeltaCell {
  type: CellType.TOTAL_DELTA;
  name: string;
  sizes: ArtifactSizes;
  percents: ArtifactSizes;
  hashChanged: boolean;
  budgets: Array<BudgetResult>;
  failingBudgets: Array<BudgetResult>;
}

export interface RevisionCell {
  type: CellType.REVISION;
  revision: string;
}

export interface RevisionDeltaCell {
  type: CellType.REVISION_DELTA;
  revision: string;
  deltaIndex: number;
  againstRevision: string;
}

export interface ArtifactCell {
  type: CellType.ARTIFACT;
  text: string;
}

export interface GroupCell {
  type: CellType.GROUP;
  text: string;
  artifactNames: Array<string>;
}
export type HeaderRow = [TextCell, ...(Array<RevisionCell | RevisionDeltaCell>)];
export type ArtifactRow = [ArtifactCell, ...(Array<TotalCell | DeltaCell>)];
export type GroupRow = [GroupCell, ...(Array<TotalCell | TotalDeltaCell>)];

export interface ComparisonMatrix {
  header: HeaderRow;
  groups: Array<GroupRow>;
  artifacts: Array<ArtifactRow>;
}

type RevisionStringFormatter = (cell: RevisionCell) => string;
type RevisionDeltaStringFormatter = (cell: RevisionDeltaCell) => string;
type TotalStringFormatter = (cell: TotalCell, sizeKey: string) => string;
type DeltaStringFormatter = (cell: DeltaCell | TotalDeltaCell, sizeKey: string) => string;
type ArtifactFilter = (row: ArtifactRow) => boolean;

interface FormattingOptions {
  formatRevision?: RevisionStringFormatter;
  formatRevisionDelta?: RevisionDeltaStringFormatter;
  formatTotal?: TotalStringFormatter;
  formatDelta?: DeltaStringFormatter;
  artifactFilter?: ArtifactFilter;
  sizeKey?: string;
}

const emptyObject = Object.freeze({});

/* eslint-disable @typescript-eslint/no-explicit-any */
const flatten = (arrays: Array<any>): Array<any> => arrays.reduce((memo: Array<any>, b: any) => memo.concat(b), []);
/* eslint-enable @typescript-eslint/no-explicit-any */

const defaultFormatRevision = (cell: RevisionCell): string => formatSha(cell.revision);
const defaultFormatRevisionDelta = (cell: RevisionDeltaCell): string => `Δ${cell.deltaIndex}`;
const defaultFormatTotal = (cell: TotalCell, sizeKey: string): string => formatBytes(cell.sizes[sizeKey] || 0);
const defaultFormatDelta = (cell: DeltaCell | TotalDeltaCell, sizeKey: string): string =>
  `${formatBytes(cell.sizes[sizeKey] || 0)} (${((cell.percents[sizeKey] || 0) * 100).toFixed(1)}%)`;
const defaultArtifactFilter = (): boolean => true;

interface ComparatorOptions {
  artifactBudgets?: ArtifactBudgets;
  artifactFilters?: ArtifactFilters;
  builds: Array<Build>;
  groups?: Array<Group>;
}

export default class BuildComparator {
  public builds: Array<Build>;

  private _artifactBudgets: ArtifactBudgets;
  private _artifactFilters: ArtifactFilters;
  private _groups: Array<Group>;

  private _artifactNames: Array<string>;
  private _sizeKeys: Array<string>;
  private _buildDeltas: Array<Array<BuildDelta>>;
  private _emptySizes: Readonly<{ [key: string]: number }>;

  private _matrixHeader: ComparisonMatrix['header'];
  private _matrixGroups: ComparisonMatrix['groups'];
  private _matrixArtifacts: ComparisonMatrix['artifacts'];

  public constructor({ artifactBudgets, artifactFilters, builds, groups }: ComparatorOptions) {
    this.builds = builds;
    this._artifactFilters = artifactFilters || [];
    this._artifactBudgets = artifactBudgets || emptyObject;
    this._groups = [{ name: 'All', artifactNames: this.artifactNames }, ...groups].filter(Boolean);
    this._emptySizes = Object.freeze(
      this.sizeKeys.reduce((memo, key) => {
        memo[key] = 0;
        return memo;
      }, {})
    );
  }

  public get artifactNames(): Array<string> {
    if (this.builds.length === 0) {
      return [];
    }

    if (!this._artifactNames) {
      this._artifactNames = Array.prototype.concat
        .apply([], this.builds.map(build => build.artifacts))
        .sort((a, b) => {
          const sizeKey = Object.keys(a.sizes)[0];
          return b.sizes[sizeKey] - a.sizes[sizeKey];
        })
        .map(artifact => artifact.name)
        .filter(
          (value, index, self) =>
            self.indexOf(value) === index && !this._artifactFilters.some(filter => filter.test(value))
        );
    }
    return this._artifactNames;
  }

  public get sizeKeys(): Array<string> {
    if (this.builds.length === 0 || this.artifactNames.length === 0) {
      return [];
    }

    if (!this._sizeKeys) {
      this._sizeKeys = Object.keys(this.builds[0].artifacts[0].sizes).sort();
      const allSizeKeys = new Set();
      this.builds.forEach(build => {
        build.artifacts.forEach(artifact => {
          Object.keys(artifact.sizes).forEach(key => {
            allSizeKeys.add(key);
          });
        });
      });

      if (allSizeKeys.size !== this._sizeKeys.length || !this._sizeKeys.every(key => allSizeKeys.has(key))) {
        throw new Error('builds provided do not have same size keys for artifacts');
      }
    }
    return this._sizeKeys;
  }

  public get buildDeltas(): Array<Array<BuildDelta>> {
    if (this.builds.length === 0) {
      return [];
    }

    if (!this._buildDeltas) {
      this._buildDeltas = this.builds.map((baseBuild, i) => {
        return this.builds.slice(0, i).map(prevBuild => {
          return new BuildDelta(baseBuild, prevBuild, {
            artifactBudgets: this._artifactBudgets,
            artifactFilters: this._artifactFilters,
            groups: this._groups
          });
        });
      });
    }

    return this._buildDeltas;
  }

  public get matrixHeader(): ComparisonMatrix['header'] {
    if (!this._matrixHeader) {
      this._matrixHeader = [
        { type: CellType.TEXT, text: '' },
        ...flatten(
          this.buildDeltas.map((buildDeltas, buildIndex) => {
            const revision = this.builds[buildIndex].getMetaValue('revision');
            return [
              { type: CellType.REVISION, revision },
              ...buildDeltas.map((buildDelta, deltaIndex) => ({
                type: CellType.REVISION_DELTA,
                deltaIndex: deltaIndex + 1,
                againstRevision: buildDelta.prevBuild.getMetaValue('revision'),
                revision
              }))
            ];
          })
        )
      ];
    }
    return this._matrixHeader;
  }

  public get matrixGroups(): ComparisonMatrix['groups'] {
    if (!this._matrixGroups) {
      this._matrixGroups = this._groups.map(group => this._getGroupRow(group));
    }
    return this._matrixGroups;
  }

  public get matrixArtifacts(): ComparisonMatrix['artifacts'] {
    if (!this._matrixArtifacts) {
      this._matrixArtifacts = this.artifactNames.map(artifactName => this._getArtifactRow(artifactName));
    }
    return this._matrixArtifacts;
  }

  private _getArtifactRow(artifactName: string): ArtifactRow {
    const cells = this.buildDeltas.map(
      (buildDeltas, i): Array<TextCell | TotalCell | DeltaCell> => {
        const artifact = this.builds[i].getArtifact(artifactName);
        return [
          {
            sizes: artifact ? artifact.sizes : this._emptySizes,
            name: artifactName,
            type: CellType.TOTAL
          },
          // @ts-ignore
          ...buildDeltas.map(buildDelta => ({
            ...buildDelta.getArtifactDelta(artifactName).toObject(),
            type: CellType.DELTA
          }))
        ];
      }
    );
    return [{ type: CellType.ARTIFACT, text: artifactName }, ...flatten(cells)];
  }

  private _getGroupRow(group: Group): GroupRow {
    let artifactNames = group.artifactNames ? [...group.artifactNames].filter(Boolean) : [];
    if (group.artifactMatch) {
      artifactNames = artifactNames.concat(this.artifactNames.filter(name => group.artifactMatch.test(name)));
    }
    const cells = this.buildDeltas.map(
      (buildDeltas, i): Array<TextCell | TotalCell | DeltaCell> => {
        const groupSizes = this.builds[i].getSum(artifactNames);
        return [
          {
            sizes: groupSizes,
            name: group.name,
            type: CellType.TOTAL
          },
          // @ts-ignore
          ...buildDeltas.map(buildDelta => ({
            ...buildDelta.getGroupDelta(group.name).toObject(),
            type: CellType.TOTAL_DELTA
          }))
        ];
      }
    );
    return [{ type: CellType.GROUP, text: group.name, artifactNames }, ...flatten(cells)];
  }

  public getStringFormattedHeader(
    formatRevision: RevisionStringFormatter = defaultFormatRevision,
    formatRevisionDelta: RevisionDeltaStringFormatter = defaultFormatRevisionDelta
  ): Array<string> {
    return this.matrixHeader.map(cell => {
      switch (cell.type) {
        case CellType.REVISION:
          return formatRevision(cell);
        case CellType.REVISION_DELTA:
          return formatRevisionDelta(cell);
        case CellType.TEXT:
          return cell.text;
      }
    });
  }

  public getStringFormattedGroups(
    formatTotal: TotalStringFormatter = defaultFormatTotal,
    formatDelta: DeltaStringFormatter = defaultFormatDelta,
    sizeKey: string = 'gzip'
  ): Array<Array<string>> {
    return this.matrixGroups.map(row =>
      row.map(
        (cell): string => {
          switch (cell.type) {
            case CellType.GROUP:
              return cell.text;
            case CellType.TOTAL_DELTA:
              return formatDelta(cell as TotalDeltaCell, sizeKey);
            case CellType.TOTAL:
              return formatTotal(cell as TotalCell, sizeKey);
          }
        }
      )
    );
  }

  public getStringFormattedRows(
    formatTotal: TotalStringFormatter = defaultFormatTotal,
    formatDelta: DeltaStringFormatter = defaultFormatDelta,
    sizeKey: string = 'gzip',
    artifactFilter: ArtifactFilter = defaultArtifactFilter
  ): Array<Array<string>> {
    return this.matrixArtifacts.filter(artifactFilter).map(
      (row): Array<string> => {
        return row.map(
          (cell): string => {
            switch (cell.type) {
              case CellType.ARTIFACT:
                return cell.text;
              case CellType.DELTA:
                return formatDelta(cell as DeltaCell, sizeKey);
              case CellType.TOTAL:
                return formatTotal(cell as TotalCell, sizeKey);
            }
          }
        );
      }
    );
  }

  public toJSON(): ComparisonMatrix {
    return {
      header: this.matrixHeader,
      groups: this.matrixGroups,
      artifacts: this.matrixArtifacts
    };
  }

  public toMarkdown({
    formatRevision,
    formatRevisionDelta,
    formatTotal,
    formatDelta,
    artifactFilter,
    sizeKey
  }: FormattingOptions = {}): string {
    const header = this.getStringFormattedHeader(formatRevision, formatRevisionDelta);
    const groups = this.getStringFormattedGroups(formatTotal, formatDelta, sizeKey);
    const rows = this.getStringFormattedRows(formatTotal, formatDelta, sizeKey, artifactFilter);

    return markdownTable([header, ...groups, ...rows], { align: rows[0].map((_, i) => (i === 0 ? 'l' : 'r')) });
  }

  public toCsv({
    formatRevision,
    formatRevisionDelta,
    formatTotal,
    formatDelta,
    artifactFilter,
    sizeKey
  }: FormattingOptions = {}): string {
    const header = this.getStringFormattedHeader(formatRevision, formatRevisionDelta);
    const groups = this.getStringFormattedGroups(formatTotal, formatDelta, sizeKey);
    const rows = this.getStringFormattedRows(formatTotal, formatDelta, sizeKey, artifactFilter);

    return [header, ...groups, ...rows].map(row => `${row.join(',')}`).join(`\r\n`);
  }
}
