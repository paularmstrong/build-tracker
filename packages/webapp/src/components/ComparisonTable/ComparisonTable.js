// @flow
import ArtifactCell from './ArtifactCell';
import IconX from '../icons/IconX';
import { interpolateHcl } from 'd3-interpolate';
import { object } from 'prop-types';
import { scaleLinear } from 'd3-scale';
import styles from './styles';
import theme from '../../theme';
import BuildComparator, { CellType } from 'build-tracker-comparator';
import { Button, Clipboard, Text, View } from 'react-native';
import { bytesToKb, formatSha } from '../../modules/formatting';
import { hsl, rgb } from 'd3-color';
import React, { Component, PureComponent } from 'react';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from '../Table';

import type { Build } from 'build-tracker-flowtypes';
import type { AppConfig, BodyCellType, DeltaCellType, TotalCellType, HeaderCellType } from 'build-tracker-comparator';

const greenScale = scaleLinear()
  .domain([1, 0])
  .interpolate(interpolateHcl)
  .range([rgb('#d0f8d7'), rgb('#55e86e')]);
const redScale = scaleLinear()
  .domain([1, 2])
  .interpolate(interpolateHcl)
  .range([rgb('#fde2e1'), rgb('#f7635b')]);

type RevisionHeaderCellProps = {
  onClickInfo: Function,
  onClickRemove: Function,
  revision: string
};

class RevisionHeaderCell extends PureComponent<RevisionHeaderCellProps> {
  render() {
    const { revision } = this.props;
    return (
      <Th style={[styles.cell, styles.header]} title={revision}>
        <View style={styles.headerContent}>
          <Text onClick={this._handleClickInfo} style={styles.headerSha}>
            {formatSha(revision)}
          </Text>
          <View onClick={this._handleClickRemove}>
            <Text style={[styles.headerButton, styles.removeBuild]}>
              <IconX />
            </Text>
          </View>
        </View>
      </Th>
    );
  }

  _handleClickRemove = () => {
    const { onClickRemove, revision } = this.props;
    onClickRemove && onClickRemove(revision);
  };

  _handleClickInfo = () => {
    const { onClickInfo, revision } = this.props;
    onClickInfo && onClickInfo(revision);
  };
}

type RevisionDeltaCellProps = {
  againstRevision: string,
  deltaIndex: number,
  revision: string
};

class RevisionDeltaCell extends Component<RevisionDeltaCellProps> {
  render() {
    const { againstRevision, deltaIndex, revision } = this.props;
    return (
      <Th
        style={[styles.cell, styles.header]}
        title={`Delta from ${formatSha(againstRevision)} to ${formatSha(revision)}`}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerSha}>{`𝚫${deltaIndex}`}</Text>
        </View>
      </Th>
    );
  }
}

const getBodySorter = (artifactNames: Array<string>) => (a: string, b: string): number => {
  return artifactNames.indexOf(a) - artifactNames.indexOf(b);
};

type DeltaCellProps = {
  gzip: number,
  gzipPercent: number,
  hashChanged: boolean,
  stat: number,
  statPercent: number,
  valueType: 'gzip' | 'stat'
};

class DeltaCell extends Component<DeltaCellProps> {
  render() {
    const { gzipPercent, valueType } = this.props;
    const value = this.props[valueType];
    const backgroundColor =
      gzipPercent > 1
        ? redScale(Math.max(Math.min(gzipPercent, 2), 1))
        : gzipPercent === 1 ? 'transparent' : greenScale(Math.max(Math.min(gzipPercent, 1), 0));
    return (
      <Td style={[styles.cell, backgroundColor && { backgroundColor }]}>
        <Text>{value ? bytesToKb(value) : '-'}</Text>
      </Td>
    );
  }
}

type ValueCellProps = {
  stat: number,
  gzip: number,
  valueType: 'gzip' | 'stat'
};

class ValueCell extends Component<ValueCellProps> {
  render() {
    const { valueType } = this.props;
    const value = this.props[valueType];
    return (
      <Td style={[styles.cell]}>
        <Text>{value ? bytesToKb(value) : '-'}</Text>
      </Td>
    );
  }
}

const sortBuilds = (a, b) => a.meta.timestamp - b.meta.timestamp;

type ComparisonProps = {
  activeArtifactNames: Array<string>,
  builds: Array<Build>,
  artifactNames: Array<string>,
  colorScale: Function,
  hoveredArtifact?: string,
  onArtifactsChange?: Function,
  onRemoveBuild?: Function,
  onShowBuildInfo?: Function,
  valueType: 'gzip' | 'stat'
};

type ComparisonState = {
  showAboveThresholdOnly: boolean,
  showDeselectedArtifacts: boolean
};

export default class Comparisons extends PureComponent<ComparisonProps, ComparisonState> {
  context: {
    config: AppConfig
  };

  static contextTypes = {
    config: object.isRequired
  };

  _data: BuildComparator;

  constructor(props: ComparisonProps, context: Object) {
    super(props, context);
    this.state = {
      showAboveThresholdOnly: false,
      showDeselectedArtifacts: true
    };
    this.setData(props);
  }

  componentWillUpdate(nextProps: ComparisonProps, nextState: ComparisonState) {
    this.setData(nextProps);
  }

  setData(props: ComparisonProps) {
    const matrixBodySorter = getBodySorter(props.artifactNames);
    this._data = new BuildComparator(props.builds.sort(sortBuilds), matrixBodySorter);
  }

  render() {
    const { activeArtifactNames, artifactNames, builds } = this.props;
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
                  return <Tr key={i}>{row.map((cell, i) => this._renderBodyCell(cell, i, artifactName))}</Tr>;
                })
              : null}
          </Tbody>
          {builds.length > 1 ? (
            <Tfoot>
              <Tr>
                <ArtifactCell
                  active={showAboveThresholdOnly}
                  artifactName="Above threshold only"
                  disabled={false}
                  color={theme.colorMidnight}
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

  _renderHeaderCell = (cell: HeaderCellType, i: number) => {
    const { onRemoveBuild, onShowBuildInfo } = this.props;
    switch (cell.type) {
      case CellType.REVISION_HEADER:
        return <RevisionHeaderCell {...cell} key={i} onClickRemove={onRemoveBuild} onClickInfo={onShowBuildInfo} />;
      case CellType.REVISION_DELTA_HEADER:
        return <RevisionDeltaCell {...cell} key={i} />;
      default:
        return <Th key={i} style={[styles.cell, styles.header]} />;
    }
  };

  _renderTotalCell = (cell: BodyCellType, i: number) => {
    const { activeArtifactNames, artifactNames } = this.props;
    switch (cell.type) {
      case CellType.ARTIFACT:
        return (
          <ArtifactCell
            active={activeArtifactNames.length === artifactNames.length}
            artifactName="All"
            color={theme.colorMidnight}
            disabled={activeArtifactNames.length === artifactNames.length}
            key={i}
            linked
            onToggle={this._handleToggleAllArtifacts}
          />
        );
      case CellType.DELTA:
        return this._renderDeltaCell(cell, i);
      case CellType.TOTAL:
      default:
        return this._renderValueCell(cell, i);
    }
  };

  _renderBodyCell = (cell: BodyCellType, i: number, artifactName: string) => {
    const { activeArtifactNames, artifactNames, colorScale, hoveredArtifact } = this.props;
    const isHovered = hoveredArtifact === artifactName;
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
        return this._renderDeltaCell(cell, i);
      case CellType.TOTAL:
      default:
        return this._renderValueCell(cell, i);
    }
  };

  _renderDeltaCell(cell: DeltaCellType, key: string | number) {
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

  _renderValueCell(cell: TotalCellType, key: string | number) {
    const { valueType } = this.props;
    return <ValueCell gzip={cell.gzip} key={key} stat={cell.stat} valueType={valueType} />;
  }

  _getActiveData() {
    const { activeArtifactNames } = this.props;
    return this._data.matrixBody.filter((row, i) => {
      return i === 0 || (row[0].text && activeArtifactNames.indexOf(row[0].text) !== -1);
    });
  }

  _getFilteredData() {
    const { config: { thresholds } } = this.context;
    return this._data.matrixBody.filter((row, i) => {
      const deltas = row.filter(cell => {
        if (cell.type === CellType.DELTA) {
          const thresholdChange = Object.keys(thresholds).some(key => {
            const threshold: number = thresholds[key];
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

  _handleToggleAllArtifacts = (value: boolean) => {
    const { artifactNames, onArtifactsChange } = this.props;
    onArtifactsChange && onArtifactsChange(artifactNames);
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
