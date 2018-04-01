// @flow
import * as React from 'react';
import ArtifactCell from './ArtifactCell';
import ArtifactRow from './ArtifactRow';
import { BuildMeta } from '@build-tracker/builds';
import deepEqual from 'deep-equal';
import DeltaCell from './DeltaCell';
import Hoverable from '../Hoverable';
import { hsl } from 'd3-color';
import memoize from 'fast-memoize';
import { object } from 'prop-types';
import RevisionDeltaCell from './RevisionDeltaCell';
import RevisionHeaderCell from './RevisionHeaderCell';
import TextCell from './TextCell';
import theme from '../../theme';
import ValueCell from './ValueCell';
import type {
  BT$AppConfig,
  BT$ArtifactFilters,
  BT$BodyCellType,
  BT$Build,
  BT$DeltaCellType,
  BT$HeaderCellType,
  BT$TotalCellType
} from '@build-tracker/types';
import BuildComparator, { CellType } from '@build-tracker/comparator';
import { Button, Clipboard, View } from 'react-native';
import { bytesToKb, formatSha } from '../../modules/formatting';
import styles, { getHeaderTopPos } from './styles';
import { Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '../Table';

const getBodySorter = (artifactNames: Array<string>) => (a: string, b: string): number => {
  return artifactNames.indexOf(a) - artifactNames.indexOf(b);
};

const sortBuilds = (a: BT$Build, b: BT$Build) => BuildMeta.getTimestamp(a) - BuildMeta.getTimestamp(b);

type Props = {
  activeArtifactNames: Array<string>,
  artifactFilters: BT$ArtifactFilters,
  builds: Array<BT$Build>,
  artifactNames: Array<string>,
  colorScale: Function,
  hoveredArtifact?: string,
  onArtifactsChange?: Function,
  onRemoveBuild?: Function,
  onShowBuildInfo?: (revision: string) => void,
  toggleGroups: { [key: string]: Array<string> },
  valueType: 'gzip' | 'stat'
};

type State = {
  comparator: BuildComparator,
  showAboveThresholdOnly: boolean,
  showDeselectedArtifacts: boolean
};

const getComparator = memoize(
  (builds: Array<BT$Build>, artifactNames: Array<string>, artifactFilters: BT$ArtifactFilters) => {
    const artifactSorter = getBodySorter(artifactNames);
    return new BuildComparator({
      builds,
      artifactFilters,
      artifactSorter
    });
  }
);

const emptyArray = [];

const createRowFilter = thresholds => {
  if (!thresholds) {
    return row => true;
  }

  return row => {
    const deltas = row.filter(cell => {
      if (cell.type === CellType.DELTA) {
        const thresholdChange = Object.keys(thresholds).some(key => {
          const threshold = thresholds[key];
          if (typeof threshold !== 'number') {
            return false;
          }
          return key.indexOf('Percent') > -1 ? 1 - cell[key] >= threshold : cell[key] >= threshold;
        });
        return thresholdChange || ((cell.stat === 0 || cell.gzip === 0) && cell.hashChanged);
      }
      return false;
    });
    if (row.length > 2 && deltas.length === 0) {
      return false;
    }
    return true;
  };
};

export default class ComparisonTable extends React.Component<Props, State> {
  context: {
    config: BT$AppConfig
  };

  static contextTypes = {
    config: object.isRequired
  };

  state = {
    comparator: getComparator([], [], []),
    showAboveThresholdOnly: false,
    showDeselectedArtifacts: true
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const comparator = getComparator(
      nextProps.builds.sort(sortBuilds),
      nextProps.artifactNames,
      nextProps.artifactFilters
    );

    if (comparator === prevState.comparator) {
      return null;
    }

    return {
      ...prevState,
      comparator
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const arePropsEqual = deepEqual(this.props, nextProps);
    const isStateEqual = deepEqual(this.state, nextState);
    return !arePropsEqual || !isStateEqual;
  }

  render() {
    const { activeArtifactNames, artifactNames, builds, hoveredArtifact, toggleGroups } = this.props;
    const { comparator, showAboveThresholdOnly, showDeselectedArtifacts } = this.state;

    const { header, total, body } = comparator.matrix;

    return builds.length ? (
      <View style={styles.root}>
        {builds.length ? (
          <Table style={styles.dataTable}>
            <Thead>
              <Tr>{header.map(this._renderHeaderCell)}</Tr>
              <Tr>{total.map((cell, i) => this._renderTotalCell(cell, i, 1))}</Tr>
              <Tr>
                {comparator
                  .getSum(activeArtifactNames)
                  .map((cell, i) =>
                    this._renderTotalCell(
                      cell,
                      i,
                      2,
                      cell.type === CellType.TEXT ? 'Selected Sum' : undefined,
                      styles.lastStickyHeader
                    )
                  )}
              </Tr>
              {Object.keys(toggleGroups).length
                ? Object.keys(toggleGroups).map((groupName, i) => {
                    const activeGroup = activeArtifactNames.slice(0).sort();
                    const group = toggleGroups[groupName].sort();
                    return (
                      <Tr key={i}>
                        <ArtifactCell
                          active={activeGroup.length === group.length && activeGroup.every((v, i) => v === group[i])}
                          artifactName={groupName}
                          color={theme.colorMidnight}
                          linked={false}
                          onToggle={this._handleToggleGroup}
                        />
                        {comparator.getSum(group).map((cell, i) => (i ? this._renderTotalCell(cell, i) : null))}
                      </Tr>
                    );
                  })
                : null}
            </Thead>
            <Tbody>
              {body.length
                ? body.map((row, i) => {
                    const artifactName = row[0].text ? row[0].text : '';
                    if (!showDeselectedArtifacts || artifactNames.indexOf(artifactName) === -1) {
                      if (activeArtifactNames.indexOf(artifactName) === -1) {
                        return null;
                      }
                    }
                    return (
                      <Hoverable key={i}>
                        {isHovered => (
                          <Tr>
                            <ArtifactRow
                              isHovered={isHovered || artifactName === hoveredArtifact}
                              render={this._renderBodyCell}
                              row={row}
                            />
                          </Tr>
                        )}
                      </Hoverable>
                    );
                  })
                : null}
            </Tbody>
            {builds.length > 1 ? (
              <Tfoot>
                <Tr>
                  <ArtifactCell
                    active={showAboveThresholdOnly}
                    artifactName="Above threshold only"
                    color={theme.colorMidnight}
                    disabled={false}
                    onToggle={this._handleRemoveBelowThreshold}
                  />
                  <Td colSpan={header.length - 1} rowSpan={2} style={styles.footer}>
                    <View style={styles.footerContent}>
                      <View style={styles.copyButton}>
                        <Button onPress={this._handleCopyToAscii} style={styles.copyButton} title="Copy to ASCII" />
                      </View>
                      <View style={styles.copyButton}>
                        <Button onPress={this._handleCopyToCSV} style={styles.copyButton} title={'Copy to CSV'} />
                      </View>
                    </View>
                  </Td>
                </Tr>
                <Tr>
                  <ArtifactCell
                    active={showDeselectedArtifacts}
                    artifactName="Show deselected"
                    color={theme.colorMidnight}
                    onToggle={this._handleShowDeselected}
                  />
                </Tr>
              </Tfoot>
            ) : null}
          </Table>
        ) : null}
      </View>
    ) : null;
  }

  _renderHeaderCell = (cell: BT$HeaderCellType, cellIndex: number) => {
    const { onRemoveBuild, onShowBuildInfo } = this.props;
    switch (cell.type) {
      case CellType.REVISION_HEADER:
        // $FlowFixMe
        return (
          <RevisionHeaderCell {...cell} key={cellIndex} onClickInfo={onShowBuildInfo} onClickRemove={onRemoveBuild} />
        );
      case CellType.REVISION_DELTA_HEADER:
        // $FlowFixMe
        return <RevisionDeltaCell {...cell} key={cellIndex} />;
      default:
        return <Th key={cellIndex} style={[styles.cell, styles.header, styles.stickyBlankHeader]} />;
    }
  };

  _renderTotalCell = (
    cell: BT$BodyCellType,
    cellIndex: number,
    rowIndex?: number,
    cellText?: string,
    style?: mixed
  ) => {
    const { activeArtifactNames, artifactNames } = this.props;
    // $FlowFixMe
    const text = cellText || (cell.hasOwnProperty('text') ? cell.text : '');
    const cellStyles = rowIndex ? [styles.header, { top: getHeaderTopPos(rowIndex) }, style] : undefined;
    switch (cell.type) {
      case CellType.ARTIFACT:
        return (
          <ArtifactCell
            active={activeArtifactNames.length === artifactNames.length}
            artifactName={text}
            color={theme.colorMidnight}
            key={cellIndex}
            linked
            onToggle={this._handleToggleAllArtifacts}
            style={cellStyles && [...cellStyles, styles.stickyColumnStickyHeader]}
          />
        );
      case CellType.TEXT:
        return (
          <TextCell
            key={cellIndex}
            style={cellStyles && [...cellStyles, styles.stickyColumnStickyHeader]}
            text={text}
          />
        );
      case CellType.TOTAL_DELTA:
      case CellType.DELTA:
        // $FlowFixMe
        return this._renderDeltaCell(cell, cellIndex, cellStyles);
      case CellType.TOTAL:
      default:
        // $FlowFixMe
        return this._renderValueCell(cell, cellIndex, undefined, false, cellStyles);
    }
  };

  _renderBodyCell = (cell: BT$BodyCellType, cellIndex: number, artifactName: string, isHovered: boolean) => {
    const { activeArtifactNames, artifactNames, colorScale } = this.props;
    const color = colorScale(artifactNames.length - artifactNames.indexOf(artifactName));
    const hoverColor = hsl(color);
    hoverColor.s = 0.7;
    hoverColor.l = 0.95;

    switch (cell && cell.type) {
      case CellType.ARTIFACT:
        return (
          <ArtifactCell
            active={activeArtifactNames.indexOf(artifactName) !== -1}
            artifactName={artifactName}
            color={color}
            hoverColor={hoverColor.toString()}
            isHovered={isHovered}
            key={cellIndex}
            linked
            onToggle={this._handleToggleArtifact}
          />
        );
      case CellType.DELTA:
        // $FlowFixMe
        return this._renderDeltaCell(cell, cellIndex);
      case CellType.TOTAL:
      default:
        // $FlowFixMe
        return this._renderValueCell(cell, cellIndex, hoverColor.toString(), isHovered);
    }
  };

  _renderDeltaCell(cell: BT$DeltaCellType, cellIndex: number, style?: mixed) {
    const { valueType } = this.props;
    return (
      <DeltaCell
        gzip={cell.gzip}
        gzipPercent={cell.gzipPercent}
        hashChanged={cell.hashChanged}
        key={cellIndex}
        stat={cell.stat}
        statPercent={cell.statPercent}
        style={style}
        valueType={valueType}
      />
    );
  }

  _renderValueCell(cell: BT$TotalCellType, cellIndex: number, hoverColor: string, isHovered: boolean, style?: mixed) {
    const { valueType } = this.props;
    return (
      <ValueCell
        gzip={cell.gzip}
        hoverColor={hoverColor}
        isHovered={isHovered}
        key={cellIndex}
        onClick={this._handleCellClick(cellIndex)}
        stat={cell.stat}
        style={style}
        valueType={valueType}
      />
    );
  }

  _handleCellClick = (cellIndex: number) => () => {
    const { builds, onShowBuildInfo } = this.props;
    if (!onShowBuildInfo) {
      return;
    }
    for (let i = 0, acc = 1; i <= builds.length; i++) {
      acc += i;
      if (cellIndex === acc) {
        onShowBuildInfo(BuildMeta.getRevision(builds[i]));
        return;
      }
    }
  };

  _getFilteredData() {
    const { config: { thresholds } } = this.context;
    const { comparator } = this.state;

    if (!thresholds) {
      return comparator.matrixBody;
    }

    const rowFilter = createRowFilter(thresholds);
    return comparator.matrixBody.filter(rowFilter);
  }

  _handleShowDeselected = (name: string, toggled: boolean) => {
    this.setState(() => ({ showDeselectedArtifacts: toggled }));
  };

  _handleRemoveBelowThreshold = (name: string, toggled: boolean) => {
    const { artifactNames, onArtifactsChange } = this.props;
    this.setState(
      () => ({ showAboveThresholdOnly: toggled }),
      () => {
        if (onArtifactsChange) {
          if (toggled) {
            const data = this._getFilteredData();
            onArtifactsChange(data.map(row => (row[0].text ? row[0].text : '')));
          } else {
            onArtifactsChange(artifactNames);
          }
        }
      }
    );
  };

  _handleToggleArtifact = (artifactName: string, value: boolean) => {
    const { activeArtifactNames, onArtifactsChange } = this.props;
    if (onArtifactsChange) {
      if (value) {
        onArtifactsChange([...activeArtifactNames, artifactName]);
      } else {
        onArtifactsChange(activeArtifactNames.filter(b => b !== artifactName));
      }
    }
  };

  _handleToggleAllArtifacts = (name: string, value: boolean) => {
    const { onArtifactsChange } = this.props;
    onArtifactsChange && onArtifactsChange(value ? [name] : emptyArray);
  };

  _handleToggleGroup = (name: string, value: boolean) => {
    const { onArtifactsChange, toggleGroups } = this.props;
    onArtifactsChange && onArtifactsChange(value ? toggleGroups[name] : emptyArray);
  };

  _handleCopyToAscii = () => {
    const { config: { thresholds } } = this.context;
    const { activeArtifactNames, artifactNames, valueType } = this.props;
    const { comparator, showAboveThresholdOnly, showDeselectedArtifacts } = this.state;

    const formatValue = cell => {
      const value = cell[valueType];
      return value ? bytesToKb(value) : '';
    };

    const thresholdRowFilter = createRowFilter(thresholds);
    const rowFilter = row => {
      const artifactName = row[0].text ? row[0].text : '';
      if (!showDeselectedArtifacts || artifactNames.indexOf(artifactName) === -1) {
        if (activeArtifactNames.indexOf(artifactName) === -1) {
          return false;
        }
      }

      return showAboveThresholdOnly ? thresholdRowFilter(row) : row => true;
    };
    const table = comparator.getAscii({
      formatRevision: cell => formatSha(cell.revision),
      formatValue,
      formatDelta: formatValue,
      rowFilter
    });

    // Clipboard requires using template strings and special encoding for newlines and spaces
    Clipboard.setString(
      `${table
        .replace(/\r?\n/g, `\r\n`)
        .replace(/^\s/gm, '')
        .replace(/ /g, `\u00A0`)}`
    );
  };

  _handleCopyToCSV = () => {
    const { comparator } = this.state;
    Clipboard.setString(comparator.getCsv());
  };
}
