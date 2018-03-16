// @flow
import * as React from 'react';
import ArtifactCell from './ArtifactCell';
import { BuildMeta } from '@build-tracker/builds';
import deepEqual from 'deep-equal';
import DeltaCell from './DeltaCell';
import Hoverable from '../Hoverable';
import { hsl } from 'd3-color';
import { object } from 'prop-types';
import RevisionDeltaCell from './RevisionDeltaCell';
import RevisionHeaderCell from './RevisionHeaderCell';
import styles from './styles';
import theme from '../../theme';
import ValueCell from './ValueCell';
import BuildComparator, { CellType } from '@build-tracker/comparator';
import { Button, Clipboard, View } from 'react-native';
import { bytesToKb, formatSha } from '../../modules/formatting';
import { Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '../Table';

const getBodySorter = (artifactNames: Array<string>) => (a: string, b: string): number => {
  return artifactNames.indexOf(a) - artifactNames.indexOf(b);
};

const sortBuilds = (a: BT$Build, b: BT$Build) => BuildMeta.getTimestamp(a) - BuildMeta.getTimestamp(b);

type Props = {
  activeArtifactNames: Array<string>,
  builds: Array<BT$Build>,
  artifactNames: Array<string>,
  colorScale: Function,
  hoveredArtifact?: string,
  onArtifactsChange?: Function,
  onRemoveBuild?: Function,
  onShowBuildInfo?: Function,
  valueType: 'gzip' | 'stat'
};

type State = {
  showAboveThresholdOnly: boolean,
  showDeselectedArtifacts: boolean
};

const emptyArray = [];

export default class ComparisonTable extends React.Component<Props, State> {
  context: {
    config: BT$AppConfig
  };

  static contextTypes = {
    config: object.isRequired
  };

  _data: BuildComparator;

  constructor(props: Props, context: Object) {
    super(props, context);
    this.state = {
      showAboveThresholdOnly: false,
      showDeselectedArtifacts: true
    };
    this.setData(props);
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const arePropsEqual = deepEqual(this.props, nextProps);
    const isStateEqual = deepEqual(this.state, nextState);
    return !arePropsEqual || !isStateEqual;
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    this.setData(nextProps);
  }

  setData(props: Props) {
    const matrixBodySorter = getBodySorter(props.artifactNames);
    this._data = new BuildComparator(props.builds.sort(sortBuilds), matrixBodySorter);
  }

  render() {
    const { activeArtifactNames, artifactNames, builds, hoveredArtifact } = this.props;
    const { showAboveThresholdOnly, showDeselectedArtifacts } = this.state;

    const { header, total, body } = this._data.matrix;

    return this._data ? (
      <View style={styles.root}>
        <Table style={styles.dataTable}>
          <Thead>
            <Tr>{header ? header.map(this._renderHeaderCell) : null}</Tr>
          </Thead>
          <Tbody>
            {total.length ? <Tr>{total.map(this._renderTotalCell)}</Tr> : null}
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
                          {row.map((cell, i) =>
                            this._renderBodyCell(cell, i, artifactName, isHovered || artifactName === hoveredArtifact)
                          )}
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
      </View>
    ) : null;
  }

  _renderHeaderCell = (cell: BT$HeaderCellType, i: number) => {
    const { onRemoveBuild, onShowBuildInfo } = this.props;
    switch (cell.type) {
      case CellType.REVISION_HEADER:
        // $FlowFixMe
        return <RevisionHeaderCell {...cell} key={i} onClickInfo={onShowBuildInfo} onClickRemove={onRemoveBuild} />;
      case CellType.REVISION_DELTA_HEADER:
        // $FlowFixMe
        return <RevisionDeltaCell {...cell} key={i} />;
      default:
        return <Th key={i} style={[styles.cell, styles.header]} />;
    }
  };

  _renderTotalCell = (cell: BT$BodyCellType, i: number) => {
    const { activeArtifactNames, artifactNames } = this.props;
    switch (cell.type) {
      case CellType.ARTIFACT:
        return (
          <ArtifactCell
            active={activeArtifactNames.length === artifactNames.length}
            artifactName="All"
            color={theme.colorMidnight}
            key={i}
            linked
            onToggle={this._handleToggleAllArtifacts}
          />
        );
      case CellType.DELTA:
        // $FlowFixMe
        return this._renderDeltaCell(cell, i);
      case CellType.TOTAL:
      default:
        // $FlowFixMe
        return this._renderValueCell(cell, i);
    }
  };

  _renderBodyCell = (cell: BT$BodyCellType, i: number, artifactName: string, isHovered: boolean) => {
    const { activeArtifactNames, artifactNames, colorScale } = this.props;
    const color = colorScale(1 - artifactNames.indexOf(artifactName));
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
            key={i}
            linked
            onToggle={this._handleToggleArtifact}
          />
        );
      case CellType.DELTA:
        // $FlowFixMe
        return this._renderDeltaCell(cell, i);
      case CellType.TOTAL:
      default:
        // $FlowFixMe
        return this._renderValueCell(cell, i, hoverColor.toString(), isHovered);
    }
  };

  _renderDeltaCell(cell: BT$DeltaCellType, key: string | number) {
    const { valueType } = this.props;
    return (
      <DeltaCell
        gzip={cell.gzip}
        gzipPercent={cell.gzipPercent}
        hashChanged={cell.hashChanged}
        key={key}
        stat={cell.stat}
        statPercent={cell.statPercent}
        valueType={valueType}
      />
    );
  }

  _renderValueCell(cell: BT$TotalCellType, key: string | number, hoverColor: string, isHovered: boolean) {
    const { valueType } = this.props;
    return (
      <ValueCell
        gzip={cell.gzip}
        hoverColor={hoverColor}
        isHovered={isHovered}
        key={key}
        stat={cell.stat}
        valueType={valueType}
      />
    );
  }

  _getFilteredData() {
    const { config: { thresholds } } = this.context;
    if (!thresholds) {
      return this._data.matrixBody;
    }

    return this._data.matrixBody.filter((row, i) => {
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
    });
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

  _handleCopyToAscii = () => {
    const { valueType } = this.props;
    const formatValue = cell => {
      const value = cell[valueType];
      return value ? bytesToKb(value) : '';
    };
    const table = this._data.getAscii({
      formatRevision: cell => formatSha(cell.revision),
      formatValue,
      formatDelta: formatValue
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
    Clipboard.setString(this._data.getCsv());
  };
}
