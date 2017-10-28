// @flow
import ArtifactCell from './ArtifactCell';
import AsciiTable from 'ascii-table';
import deepEqual from 'deep-equal';
import IconX from '../icons/IconX';
import { interpolateHcl } from 'd3-interpolate';
import { scaleLinear } from 'd3-scale';
import styles from './styles';
import theme from '../../theme';
import ValueCell from './ValueCell';
import { bytesToKb, formatSha } from '../../modules/formatting';
import React, { PureComponent } from 'react';
import { Button, Clipboard, Text, View } from 'react-native';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from '../Table';
import { hsl, rgb } from 'd3-color';

import type { Build } from '../../types';

const identity = d => d;

const flatten = (arrays: Array<any>) => arrays.reduce((memo: Array<any>, b: any) => memo.concat(b), []);

const greenScale = scaleLinear()
  .domain([1, 0])
  .interpolate(interpolateHcl)
  .range([rgb('#d0f8d7'), rgb('#55e86e')]);
const redScale = scaleLinear()
  .domain([1, 2])
  .interpolate(interpolateHcl)
  .range([rgb('#fde2e1'), rgb('#f7635b')]);

const getDeltaColor = (originalValue, newValue) => {
  if (originalValue === newValue) {
    return '';
  }
  if (!originalValue) {
    return redScale(2);
  }
  if (!newValue) {
    return greenScale(1);
  }

  const percentDiff = Math.abs(newValue / originalValue);
  return percentDiff > 1
    ? redScale(Math.max(Math.min(percentDiff, 2), 1))
    : greenScale(Math.max(Math.min(percentDiff, 1), 0));
};

const getTableHeaders = (builds: Array<Build>) =>
  builds.map((build, i) => {
    const { revision } = build.meta;
    const headers = [{ text: revision, removable: true }];
    if (i > 0) {
      headers.push({ text: '𝚫', title: 'Change from previous selected build' });
    }
    if (i > 1) {
      headers.push({ text: '𝚫0', title: 'Change from first selected build' });
    }
    return headers;
  });

const getTableBody = (artifactNames: Array<string>, builds: Array<Build>, valueAccessor: Function) => {
  const artifactMap = artifactNames.map((artifactName, i) => {
    const originalValue = builds.length ? valueAccessor(builds[0].artifacts[artifactName]) : 0;
    return [
      { link: `/${artifactName}`, text: artifactName },
      ...flatten(
        builds.map((build, i) => {
          const value = valueAccessor(build.artifacts[artifactName]);
          if (i === 0) {
            return [{ bytes: value }];
          }
          const oldValue = valueAccessor(builds[i - 1].artifacts[artifactName]);
          const delta = value - oldValue;
          const values = [{ bytes: value }, { bytes: delta, color: getDeltaColor(oldValue, value) }];
          if (i > 1) {
            values.push({ bytes: value - originalValue, color: getDeltaColor(originalValue, value) });
          }
          return values;
        })
      )
    ];
  });

  return [getTotals(builds, valueAccessor), ...artifactMap];
};

const getTotals = (builds: Array<Build>, valueAccessor: Function) => {
  const totals = builds.map(build =>
    Object.values(build.artifacts).reduce((memo, artifact) => memo + valueAccessor(artifact), 0)
  );

  const totalsWithDelta = flatten(
    totals.map((total, i) => {
      if (i === 0) {
        return [{ bytes: total }];
      }
      const bytes = total - totals[i - 1];
      const values = [{ bytes: total }, { bytes, color: getDeltaColor(totals[i - 1], total) }];
      if (i > 1) {
        const bytes = total - totals[0];
        values.push({ bytes, color: getDeltaColor(totals[0], total) });
      }
      return values;
    })
  );

  return [{ link: '/', text: 'All' }, ...totalsWithDelta];
};

const createTableData = (artifactNames: Array<string>, builds: Array<Build>, valueAccessor: Function) => {
  return {
    head: [[{}], ...getTableHeaders(builds)],
    body: getTableBody(artifactNames, builds, valueAccessor)
  };
};

class Heading extends PureComponent {
  props: {
    onClickInfo?: Function,
    onClickRemove?: Function,
    text: string,
    title?: string
  };

  static defaultProps = {
    text: ''
  };

  render() {
    const { onClickRemove, text, title } = this.props;
    return (
      <Th style={[styles.cell, styles.header]} title={title}>
        {onClickRemove ? (
          <View style={styles.headerContent}>
            <Text onClick={this._handleClickInfo} style={styles.headerSha}>
              {formatSha(text)}
            </Text>
            <View onClick={this._handleClickRemove} style={[styles.headerButton, styles.removeBuild]}>
              <IconX />
            </View>
          </View>
        ) : (
          text
        )}
      </Th>
    );
  }

  _handleClickRemove = () => {
    const { onClickRemove, text } = this.props;
    onClickRemove && onClickRemove(text);
  };

  _handleClickInfo = () => {
    const { onClickInfo, text } = this.props;
    onClickInfo && onClickInfo(text);
  };
}

type HeaderCell = { link?: string, text?: string };
type BodyCell = { link?: string, text?: string, bytes?: number, color?: string };

export default class Comparisons extends PureComponent {
  props: {
    activeArtifactNames: Array<string>,
    builds: Array<Build>,
    artifactNames: Array<string>,
    colorScale: Function,
    hoveredArtifact?: string,
    onArtifactsChange?: Function,
    onRemoveBuild?: Function,
    onShowBuildInfo?: Function,
    valueAccessor: Function
  };

  state: {
    showDeselectedArtifacts: boolean
  };

  _data: {
    head: Array<Array<HeaderCell>>,
    body: Array<Array<BodyCell>>
  };

  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {
      showDeselectedArtifacts: true
    };
    this._data = createTableData(props.artifactNames, props.builds, props.valueAccessor);
  }

  componentWillUpdate(nextProps: Object, nextState: Object) {
    this._data = createTableData(nextProps.artifactNames, nextProps.builds, nextProps.valueAccessor);
  }

  render() {
    const {
      activeArtifactNames,
      builds,
      artifactNames,
      colorScale,
      hoveredArtifact,
      onRemoveBuild,
      onShowBuildInfo
    } = this.props;

    const { showDeselectedArtifacts } = this.state;
    const body = showDeselectedArtifacts ? this._data.body : this._getActiveData();
    const hiddenRowCount = this._data.body.length - body.length;
    const headers = flatten(this._data.head);

    return (
      <View style={styles.root}>
        <Table style={styles.dataTable}>
          <Thead>
            <Tr>
              {headers.map((column, i) => (
                <Heading
                  {...column}
                  key={i}
                  onClickRemove={column.removable && onRemoveBuild}
                  onClickInfo={column.removable && onShowBuildInfo}
                />
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {body.length
              ? body.map((row, i) => {
                  const artifact = row[0].text;
                  const isAll = artifact === 'All';
                  const isHovered = hoveredArtifact === artifact;
                  const color =
                    isAll || !artifact ? theme.colorMidnight : colorScale(1 - artifactNames.indexOf(artifact));
                  const hoverColor = hsl(color);
                  hoverColor.s = 0.7;
                  hoverColor.l = 0.95;
                  return (
                    <Tr key={i}>
                      {row.map((column, i) => {
                        if (i === 0) {
                          const { link, text } = column;
                          return (
                            <ArtifactCell
                              active={
                                isAll || !text
                                  ? activeArtifactNames.length === artifactNames.length
                                  : activeArtifactNames.indexOf(text) !== -1
                              }
                              artifactName={text}
                              color={color}
                              disabled={isAll && activeArtifactNames.length === artifactNames.length}
                              hoverColor={hoverColor.toString()}
                              isHovered={isHovered}
                              key={i}
                              onToggle={isAll ? this._handleToggleAllArtifacts : this._handleToggleArtifact}
                              link={link}
                            />
                          );
                        }
                        return (
                          <ValueCell {...column} hoverColor={hoverColor.toString()} isHovered={isHovered} key={i} />
                        );
                      })}
                    </Tr>
                  );
                })
              : null}
          </Tbody>
          {builds.length > 1 ? (
            <Tfoot>
              <Tr>
                <ArtifactCell
                  active={deepEqual(
                    this._getFilteredData()
                      .map(row => row[0].text)
                      .slice(1),
                    activeArtifactNames
                  )}
                  artifactName="Above threshold only"
                  disabled={
                    this._getFilteredData()
                      .map(row => row[0].text)
                      .slice(1).length === 0
                  }
                  color={theme.colorMidnight}
                  onToggle={this._handleRemoveBelowThreshold}
                />
                <Td colSpan={headers.length - 1} rowSpan={2} style={styles.footer}>
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
                  active={!hiddenRowCount}
                  artifactName="Show deselected"
                  color={theme.colorMidnight}
                  onToggle={this._handleHideBelowThreshold}
                />
              </Tr>
            </Tfoot>
          ) : null}
        </Table>
      </View>
    );
  }

  _getActiveData() {
    const { activeArtifactNames } = this.props;
    return this._data.body.filter((row, i) => {
      return i === 0 || (row[0].text && activeArtifactNames.indexOf(row[0].text) !== -1);
    });
  }

  _getFilteredData() {
    return this._data.body.filter((row, i) => {
      const deltas = row.filter(column => column.color && column.bytes && Math.abs(column.bytes) > 100);
      if (i !== 0 && row.length > 2 && deltas.length === 0) {
        return false;
      }
      return true;
    });
  }

  _handleHideBelowThreshold = (name: string, toggled: boolean) => {
    this.setState({ showDeselectedArtifacts: toggled });
  };

  _handleRemoveBelowThreshold = (name: string, toggled: boolean) => {
    const { artifactNames, onArtifactsChange } = this.props;
    if (onArtifactsChange) {
      if (toggled) {
        const data = this._getFilteredData();
        onArtifactsChange(data.map(row => row[0].text));
      } else {
        onArtifactsChange(artifactNames);
      }
    }
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

  _getTableAsMatrix = (formatHeader: Function = identity, formatBytes: Function = identity) => {
    const { showDeselectedArtifacts } = this.state;
    const { body, head } = this._data;
    const visibleBody = showDeselectedArtifacts ? body : this._getActiveData();
    const header = flatten(head).map(cell => (cell.removable ? formatHeader(cell.text) : cell.text));
    const rows = visibleBody.map(row =>
      row.map(cell => (cell.bytes ? formatBytes(cell.bytes) : cell.text || cell.bytes))
    );
    return [header, ...rows];
  };

  _handleCopyToAscii = () => {
    const [header, ...rows] = this._getTableAsMatrix(formatSha, bytesToKb);
    const table = new AsciiTable('');
    table
      .setBorder('|', '-', '', '')
      .setHeading(...header)
      .addRowMatrix(rows);
    const hiddenRowCount = this._data.body.length - rows.length;
    if (hiddenRowCount) {
      table.addRow(`${hiddenRowCount} artifacts hidden`);
    }

    header.forEach((h, i) => {
      table.setAlignRight(i);
    });

    // Clipboard requires using template strings and special encoding for newlines and spaces
    Clipboard.setString(
      `${table
        .toString()
        .replace(/\r?\n/g, `\r\n`)
        .replace(/ /g, `\u00A0`)}`
    );
  };

  _handleCopyToCSV = () => {
    const matrix = this._getTableAsMatrix();
    // Clipboard requires using template strings and special encoding for newlines and spaces
    Clipboard.setString(`${matrix.map(row => `${row.join(',')}`).join(`\r\n`)}`);
  };
}
