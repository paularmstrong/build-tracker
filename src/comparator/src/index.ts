/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import BuildDelta from './BuildDelta';
import markdownTable from 'markdown-table';
import { ArtifactBudgets, ArtifactFilters, Budget, BudgetLevel, BudgetResult, Group } from '@build-tracker/types';
import {
  formatBudgetResult,
  formatBytes,
  formatSha,
  formatUnexpectedHashChange,
  levelToEmoji,
} from '@build-tracker/formatting';

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
  GROUP = 'group',
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
  hashChangeUnexpected: boolean;
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
  hashChangeUnexpected: boolean;
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
export type HeaderRow = [TextCell, ...Array<RevisionCell | RevisionDeltaCell>];
export type ArtifactRow = [ArtifactCell, ...Array<TotalCell | DeltaCell>];
export type GroupRow = [GroupCell, ...Array<TotalCell | TotalDeltaCell>];

export interface ComparisonMatrix {
  header: HeaderRow;
  groups: Array<GroupRow>;
  artifacts: Array<ArtifactRow>;
}

export type CellTextStringFormatter = (cell: TextCell | GroupCell | ArtifactCell) => string;
export type RevisionStringFormatter = (cell: RevisionCell) => string;
export type RevisionDeltaStringFormatter = (cell: RevisionDeltaCell) => string;
export type TotalStringFormatter = (cell: TotalCell, sizeKey: string) => string;
export type DeltaStringFormatter = (cell: DeltaCell | TotalDeltaCell, sizeKey: string) => string;
export type ArtifactFilter = (row: ArtifactRow) => boolean;

export interface FormattingOptions {
  formatCellText?: CellTextStringFormatter;
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

const defaultFormatCellText = (cell: TextCell | GroupCell | ArtifactCell): string => cell.text;
const formatCellTextMarkdown = (cell: TextCell | GroupCell | ArtifactCell): string => cell.text.replace(/~/g, '\\~');
const defaultFormatRevision = (cell: RevisionCell): string => formatSha(cell.revision);
const defaultFormatRevisionDelta = (cell: RevisionDeltaCell): string => `Δ${cell.deltaIndex}`;
const defaultFormatTotal = (cell: TotalCell, sizeKey: string): string => formatBytes(cell.sizes[sizeKey] || 0);
const defaultFormatDelta = (cell: DeltaCell | TotalDeltaCell, sizeKey: string): string => {
  const errorFailingBudgets = cell.failingBudgets.some((result) => result.level === BudgetLevel.ERROR);
  const warningFailingBudgets = cell.failingBudgets.some((result) => result.level === BudgetLevel.WARN);

  return `${
    errorFailingBudgets
      ? `${levelToEmoji[BudgetLevel.ERROR]} `
      : warningFailingBudgets
      ? `${levelToEmoji[BudgetLevel.WARN]} `
      : cell.hashChangeUnexpected
      ? `${levelToEmoji['hash']} `
      : ''
  }${formatBytes(cell.sizes[sizeKey] || 0)} (${((cell.percents[sizeKey] || 0) * 100).toFixed(1)}%)`;
};
const defaultArtifactFilter = (): boolean => true;

const deserializeRegExp = (input: string): RegExp => {
  const m = input.match(/\/(.*)\/(.*)?/);
  return new RegExp(m[1], m[2] || '');
};

const getFailingBudgetsFromRow = (
  rows: Array<ArtifactRow | GroupRow>,
  level?: BudgetLevel
): Array<{ name: string; result: BudgetResult }> => {
  return rows.reduce((failures, row) => {
    row.forEach((cell) => {
      if (cell.type !== CellType.TOTAL_DELTA && cell.type !== CellType.DELTA) {
        return;
      }
      cell.failingBudgets.forEach((budget) => {
        if (level && budget.level !== level) {
          return;
        }
        failures.push({ name: row[0].text, result: budget });
      });
    });
    return failures;
  }, []);
};

interface ComparatorOptions {
  artifactBudgets?: ArtifactBudgets;
  artifactFilters?: ArtifactFilters;
  budgets?: Array<Budget>;
  builds: Array<Build>;
  groups?: Array<Group>;
}

export default class BuildComparator {
  builds: Array<Build>;

  #artifactBudgets: ArtifactBudgets;
  #artifactFilters: ArtifactFilters;
  #groups: Array<Group>;

  #artifactNames: Array<string>;
  #sizeKeys: Array<string>;
  #buildDeltas: Array<Array<BuildDelta>>;
  #emptySizes: Readonly<{ [key: string]: number }>;

  #matrixHeader: ComparisonMatrix['header'];
  #matrixGroups: ComparisonMatrix['groups'];
  #matrixArtifacts: ComparisonMatrix['artifacts'];

  #errors: Array<{ name: string; result: BudgetResult }>;
  #warnings: Array<{ name: string; result: BudgetResult }>;
  #unexpectedHashChanges: Array<{ name: string }>;

  constructor({ artifactBudgets, artifactFilters, budgets, builds, groups }: ComparatorOptions) {
    this.builds = builds
      .sort((buildA, buildB) => {
        const diff = buildA.timestamp.valueOf() - buildB.timestamp.valueOf();
        if (diff > 0) {
          return 1;
        } else if (diff < 0) {
          return -1;
        }
        return 0;
      })
      .sort((buildA, buildB) => {
        if (buildA.getMetaValue('parentRevision') === buildB.getMetaValue('revision')) {
          return 1;
        }
        if (buildB.getMetaValue('revision') === buildA.getMetaValue('parentRevision')) {
          return -1;
        }
        return 0;
      });
    this.#artifactFilters = artifactFilters || [];
    this.#artifactBudgets = artifactBudgets || emptyObject;
    this.#groups = [{ name: 'All', artifactNames: this.artifactNames, budgets }, ...(groups || [])].filter(Boolean);
    this.#emptySizes = Object.freeze(
      this.sizeKeys.reduce((memo, key) => {
        memo[key] = 0;
        return memo;
      }, {})
    );
  }

  static deserialize(data: string): BuildComparator {
    const objData = JSON.parse(data);
    return new BuildComparator({
      ...objData,
      artifactFilters: objData.artifactFilters.map(deserializeRegExp),
      builds: objData.builds.map((d) => Build.fromJSON(d)),
      groups: objData.groups.map((g) => ({
        ...g,
        artifactMatch: g.artifactMatch && deserializeRegExp(g.artifactMatch),
      })),
    });
  }

  serialize(): string {
    return JSON.stringify({
      artifactBudgets: this.#artifactBudgets,
      artifactFilters: this.#artifactFilters.map((f) => f.toString()),
      budgets: this.#groups[0].budgets,
      builds: this.builds.map((b) => b.toJSON()),
      groups: this.#groups.slice(1).map((g) => ({
        ...g,
        artifactMatch: g.artifactMatch && g.artifactMatch.toString(),
      })),
    });
  }

  get artifactNames(): Array<string> {
    if (this.builds.length === 0) {
      return [];
    }

    if (!this.#artifactNames) {
      this.#artifactNames = Array.prototype.concat
        .apply(
          [],
          this.builds.map((build) => build.artifacts)
        )
        .sort((a, b) => {
          const sizeKey = Object.keys(a.sizes)[0];
          return b.sizes[sizeKey] - a.sizes[sizeKey];
        })
        .map((artifact) => artifact.name)
        .filter(
          (value, index, self) =>
            self.indexOf(value) === index && !this.#artifactFilters.some((filter) => filter.test(value))
        );
    }
    return this.#artifactNames;
  }

  get sizeKeys(): Array<string> {
    if (this.builds.length === 0 || this.artifactNames.length === 0) {
      return [];
    }

    if (!this.#sizeKeys) {
      this.#sizeKeys = Object.keys(this.builds[0].artifacts[0].sizes).sort();
      const allSizeKeys = new Set();
      this.builds.forEach((build) => {
        build.artifacts.forEach((artifact) => {
          Object.keys(artifact.sizes).forEach((key) => {
            allSizeKeys.add(key);
          });
        });
      });

      if (allSizeKeys.size !== this.#sizeKeys.length || !this.#sizeKeys.every((key) => allSizeKeys.has(key))) {
        throw new Error('builds provided do not have same size keys for artifacts');
      }
    }
    return this.#sizeKeys;
  }

  get buildDeltas(): Array<Array<BuildDelta>> {
    if (this.builds.length === 0) {
      return [];
    }

    if (!this.#buildDeltas) {
      this.#buildDeltas = this.builds.map((baseBuild, i) => {
        return this.builds.slice(0, i).map((prevBuild) => {
          return new BuildDelta(baseBuild, prevBuild, {
            artifactBudgets: this.#artifactBudgets,
            artifactFilters: this.#artifactFilters,
            groups: this.#groups,
          });
        });
      });
    }

    return this.#buildDeltas;
  }

  get matrixHeader(): ComparisonMatrix['header'] {
    if (!this.#matrixHeader) {
      this.#matrixHeader = [
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
                revision,
              })),
            ];
          })
        ),
      ];
    }
    return this.#matrixHeader;
  }

  get matrixGroups(): ComparisonMatrix['groups'] {
    if (!this.#matrixGroups) {
      this.#matrixGroups = this.#groups.map((group) => this.#getGroupRow(group));
    }
    return this.#matrixGroups;
  }

  get matrixArtifacts(): ComparisonMatrix['artifacts'] {
    if (!this.#matrixArtifacts) {
      this.#matrixArtifacts = this.artifactNames.map((artifactName) => this.#getArtifactRow(artifactName));
    }
    return this.#matrixArtifacts;
  }

  get errors(): Array<{ name: string; result: BudgetResult }> {
    if (!this.#errors) {
      const groupResults = getFailingBudgetsFromRow(this.matrixGroups, BudgetLevel.ERROR);
      const artifactResults = getFailingBudgetsFromRow(this.matrixArtifacts, BudgetLevel.ERROR);

      this.#errors = [...groupResults, ...artifactResults].filter(Boolean);
    }
    return this.#errors;
  }

  get warnings(): Array<{ name: string; result: BudgetResult }> {
    if (!this.#warnings) {
      const groupResults = getFailingBudgetsFromRow(this.matrixGroups, BudgetLevel.WARN);
      const artifactResults = getFailingBudgetsFromRow(this.matrixArtifacts, BudgetLevel.WARN);

      this.#warnings = [...groupResults, ...artifactResults].filter(Boolean);
    }
    return this.#warnings;
  }

  get unexpectedHashChanges(): Array<{ name: string }> {
    if (!this.#unexpectedHashChanges) {
      this.#unexpectedHashChanges = this.matrixArtifacts.reduce((memo, row) => {
        row.forEach((cell) => {
          if (cell.type !== CellType.DELTA) {
            return;
          }
          if (cell.hashChangeUnexpected) {
            memo.push({ name: cell.name });
          }
        });
        return memo;
      }, []);
    }
    return this.#unexpectedHashChanges;
  }

  #getArtifactRow(artifactName: string): ArtifactRow {
    const cells = this.buildDeltas.map(
      (buildDeltas, i): Array<TextCell | TotalCell | DeltaCell> => {
        const artifact = this.builds[i].getArtifact(artifactName);
        return [
          {
            sizes: artifact ? artifact.sizes : this.#emptySizes,
            name: artifactName,
            type: CellType.TOTAL,
          },
          // @ts-ignore
          ...buildDeltas.map((buildDelta) => ({
            ...buildDelta.getArtifactDelta(artifactName).toObject(),
            type: CellType.DELTA,
          })),
        ];
      }
    );
    return [{ type: CellType.ARTIFACT, text: artifactName }, ...flatten(cells)];
  }

  #getGroupRow(group: Group): GroupRow {
    let artifactNames = group.artifactNames ? [...group.artifactNames].filter(Boolean) : [];
    if (group.artifactMatch) {
      artifactNames = artifactNames.concat(this.artifactNames.filter((name) => group.artifactMatch.test(name)));
    }
    const cells = this.buildDeltas.map(
      (buildDeltas, i): Array<TextCell | TotalCell | DeltaCell> => {
        const groupSizes = this.builds[i].getSum(artifactNames);
        return [
          {
            sizes: groupSizes,
            name: group.name,
            type: CellType.TOTAL,
          },
          // @ts-ignore
          ...buildDeltas.map((buildDelta) => ({
            ...buildDelta.getGroupDelta(group.name).toObject(),
            type: CellType.TOTAL_DELTA,
          })),
        ];
      }
    );
    return [{ type: CellType.GROUP, text: group.name, artifactNames }, ...flatten(cells)];
  }

  getStringFormattedHeader(
    formatRevision: RevisionStringFormatter = defaultFormatRevision,
    formatRevisionDelta: RevisionDeltaStringFormatter = defaultFormatRevisionDelta
  ): Array<string> {
    return this.matrixHeader.map((cell) => {
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

  getStringFormattedGroups(
    formatCellText: CellTextStringFormatter = defaultFormatCellText,
    formatTotal: TotalStringFormatter = defaultFormatTotal,
    formatDelta: DeltaStringFormatter = defaultFormatDelta,
    sizeKey = 'gzip'
  ): Array<Array<string>> {
    return this.matrixGroups.map((row) =>
      row.map((cell): string => {
        switch (cell.type) {
          case CellType.GROUP:
            return formatCellText(cell as GroupCell);
          case CellType.TOTAL_DELTA:
            return formatDelta(cell as TotalDeltaCell, sizeKey);
          case CellType.TOTAL:
            return formatTotal(cell as TotalCell, sizeKey);
        }
      })
    );
  }

  getStringFormattedRows(
    formatCellText: CellTextStringFormatter = defaultFormatCellText,
    formatTotal: TotalStringFormatter = defaultFormatTotal,
    formatDelta: DeltaStringFormatter = defaultFormatDelta,
    sizeKey = 'gzip',
    artifactFilter: ArtifactFilter = defaultArtifactFilter
  ): Array<Array<string>> {
    return this.matrixArtifacts.filter(artifactFilter).map(
      (row): Array<string> => {
        return row.map((cell): string => {
          switch (cell.type) {
            case CellType.ARTIFACT:
              return formatCellText(cell as ArtifactCell);
            case CellType.DELTA:
              return formatDelta(cell as DeltaCell, sizeKey);
            case CellType.TOTAL:
              return formatTotal(cell as TotalCell, sizeKey);
          }
        });
      }
    );
  }

  toJSON(): ComparisonMatrix {
    return {
      header: this.matrixHeader,
      groups: this.matrixGroups,
      artifacts: this.matrixArtifacts,
    };
  }

  toMarkdown({
    formatCellText = formatCellTextMarkdown,
    formatRevision,
    formatRevisionDelta,
    formatTotal,
    formatDelta,
    artifactFilter,
    sizeKey,
  }: FormattingOptions = {}): string {
    const header = this.getStringFormattedHeader(formatRevision, formatRevisionDelta);
    const groups = this.getStringFormattedGroups(formatCellText, formatTotal, formatDelta, sizeKey);
    const rows = this.getStringFormattedRows(formatCellText, formatTotal, formatDelta, sizeKey, artifactFilter);

    const allRows = [header, ...groups, ...rows];

    return markdownTable(allRows, { align: allRows[0].map((_, i) => (i === 0 ? 'l' : 'r')) });
  }

  toCsv({
    formatCellText,
    formatRevision,
    formatRevisionDelta,
    formatTotal,
    formatDelta,
    artifactFilter,
    sizeKey,
  }: FormattingOptions = {}): string {
    const header = this.getStringFormattedHeader(formatRevision, formatRevisionDelta);
    const groups = this.getStringFormattedGroups(formatCellText, formatTotal, formatDelta, sizeKey);
    const rows = this.getStringFormattedRows(formatCellText, formatTotal, formatDelta, sizeKey, artifactFilter);

    return [header, ...groups, ...rows].map((row) => `${row.join(',')}`).join(`\r\n`);
  }

  toSummary(useEmoji = true): Array<string> {
    const groupResults = getFailingBudgetsFromRow(this.matrixGroups).map(({ name, result }) => {
      return formatBudgetResult(result, `Group "${name}"`, useEmoji);
    });
    const artifactResults = getFailingBudgetsFromRow(this.matrixArtifacts).map(({ name, result }) => {
      return formatBudgetResult(result, name, useEmoji);
    });
    const unexpectedHashChanges = this.unexpectedHashChanges.map(({ name }) => {
      return formatUnexpectedHashChange(name, useEmoji);
    });
    const output = [...groupResults, ...artifactResults, ...unexpectedHashChanges].filter(Boolean);
    if (output.length === 0) {
      return [`${useEmoji ? '✅' : 'Success:'} No failing budgets`];
    }
    return output;
  }
}
