import { Bundle } from './Bundles';
import Link from './Link';
import theme from './theme';
import { bytesToKb, formatSha } from './formatting';
import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from './Table';
import { scaleLinear } from 'd3-scale';
import { interpolateHcl } from 'd3-interpolate';
import { rgb } from 'd3-color';

import type { Build } from './types';

const emptyObject = {};

const flatten = (arrays: Array<any>) => arrays.reduce((memo: Array<any>, b: any) => memo.concat(b), []);

const greenScale = scaleLinear().domain([0, 1]).interpolate(interpolateHcl).range([rgb('#97ff7c'), rgb('#166b00')]);
const redScale = scaleLinear().domain([0, 1]).interpolate(interpolateHcl).range([rgb('#ff8787'), rgb('#7c0014')]);

const getDeltaColor = (originalValue, newValue) => {
  if (!originalValue || originalValue === newValue) {
    return 'transparent';
  }
  const percentDiff = Math.abs(newValue / originalValue);
  return percentDiff >= 1 ? redScale(1 - percentDiff) : greenScale(1 - percentDiff);
};

const getTableHeaders = builds =>
  builds.map((build, i) => {
    const { revision } = build.build;
    const headers = [{ text: revision, removable: true }];
    if (i > 0) {
      headers.push({ text: '𝚫', title: 'Change from previous selected build' });
    }
    if (i > 1) {
      headers.push({ text: '𝚫0', title: 'Change from first selected build' });
    }
    return headers;
  });

const getTableBody = (bundles: Array<string>, builds: Array<Build>, valueAccessor: Function) => {
  const bundleMap = bundles.map((bundle, i) => {
    const originalValue = builds.length ? valueAccessor(builds[0].stats[bundle]) : 0;
    return [
      bundle,
      ...builds.map((build, i) => {
        const value = valueAccessor(build.stats[bundle]);
        if (i === 0) {
          return [{ bytes: value }];
        }
        const oldValue = valueAccessor(builds[i - 1].stats[bundle]);
        const delta = value - oldValue;
        const values = [{ bytes: value }, { bytes: delta, color: getDeltaColor(oldValue, value) }];
        if (i > 1) {
          values.push({ bytes: value - originalValue, color: getDeltaColor(originalValue, value) });
        }
        return values;
      })
    ];
  });

  return [getTotals(builds, valueAccessor), ...bundleMap];
};

const getTotals = (builds: Array<Build>, valueAccessor: Function) => {
  const totals = builds.map(build =>
    Object.values(build.stats).reduce((memo, bundle) => memo + valueAccessor(bundle), 0)
  );

  const totalsWithDelta = totals.map((total, i) => {
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
  });

  return ['Total', ...totalsWithDelta];
};

const createTableData = (bundles: Array<string>, builds: Array<Build>, valueAccessor: Function) => {
  return {
    head: [[{}], ...getTableHeaders(builds)],
    body: getTableBody(bundles, builds, valueAccessor)
  };
};

class Heading extends PureComponent {
  props: {
    onClick?: Function,
    removable?: boolean,
    text: string,
    title?: string
  };

  static defaultProps = {
    text: ''
  };

  render() {
    const { onClick, removable, text, title } = this.props;
    return (
      <Th style={styles.header} title={title}>
        {removable && onClick
          ? <button onClick={this._handleClick}>
              {formatSha(text)}
            </button>
          : text}
      </Th>
    );
  }

  _handleClick = event => {
    const { onClick, text } = this.props;
    onClick(text);
  };
}

class ValueCell extends PureComponent {
  props: {
    bytes: number,
    color?: string,
    colSpan?: number
  };

  static defaultProps = {
    colSpan: 1
  };

  render() {
    const { bytes, color, colSpan } = this.props;
    return (
      <Td colSpan={colSpan} style={[styles.cell, color ? { backgroundColor: color } : emptyObject]}>
        {bytes ? bytesToKb(bytes) : '-'}
      </Td>
    );
  }
}

class BundleCell extends PureComponent {
  props: {
    bundle: string,
    color?: string
  };

  render() {
    const { bundle, color } = this.props;
    const isAll = this._isAll();
    return (
      <Th style={[styles.cell, styles.rowHeader]}>
        <Bundle active bundle={bundle} color={color} />
      </Th>
    );
  }

  _isAll() {
    return this.props.bundle === 'Total';
  }
}

export default class Comparisons extends PureComponent {
  props: {
    builds: Array<Build>,
    bundles: Array<string>,
    colorScale: Function,
    onRemoveBuild?: Function,
    valueAccessor: Function
  };

  state: {
    hideBelowThreshold: boolean
  };

  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {
      hideBelowThreshold: true
    };
  }

  render() {
    const { builds, bundles, colorScale, onRemoveBuild, valueAccessor } = this.props;
    const { hideBelowThreshold } = this.state;

    const data = createTableData(bundles, builds, valueAccessor);
    const body = hideBelowThreshold
      ? data.body.filter((row, i) => {
          const deltas = row.filter(columns => columns.length > 1 && Math.abs(columns[1].bytes) > 100);
          if (i !== 0 && row.length > 2 && deltas.length === 0) {
            return false;
          }
          return true;
        })
      : data.body;
    const hiddenRowCount = data.body.length - body.length;
    const headers = flatten(data.head);

    return (
      <Table style={styles.dataTable}>
        <Thead>
          <Tr>
            {headers.map((column, i) => <Heading {...column} key={i} onClick={onRemoveBuild} />)}
          </Tr>
        </Thead>
        <Tbody>
          {body.length
            ? body.map((row, i) =>
                <Tr key={i}>
                  {flatten(row).map((column, i) => {
                    if (i === 0) {
                      return <BundleCell bundle={column} color={colorScale(1 - bundles.indexOf(column))} key={i} />;
                    }
                    return <ValueCell {...column} key={i} />;
                  })}
                </Tr>
              )
            : null}
        </Tbody>
        {builds.length > 1
          ? <Tfoot>
              <Tr>
                <Td colSpan={headers.length} style={styles.footer}>
                  {hiddenRowCount
                    ? <Text style={styles.footerText}>
                        {hiddenRowCount} rows hidden{' '}
                        <View onClick={this._toggleHidden} style={[styles.footerText, styles.toggle]}>
                          Click to show
                        </View>
                      </Text>
                    : <Text onClick={this._toggleHidden} style={styles.toggle}>
                        Click to hide rows below change threshold
                      </Text>}
                </Td>
              </Tr>
            </Tfoot>
          : null}
      </Table>
    );
  }

  _toggleHidden = () => {
    this.setState(() => ({ hideBelowThreshold: !this.state.hideBelowThreshold }));
  };
}

const styles = StyleSheet.create({
  dataTable: {
    fontSize: theme.fontSizeSmall,
    borderSpacing: 0,
    borderCollapse: 'collapse'
  },
  rowHeader: {
    textAlign: 'right',
    paddingRight: theme.spaceXXSmall
  },
  rowColor: {
    display: 'inline-flex',
    width: '1em',
    height: '1em',
    borderRadius: '50%',
    marginLeft: theme.spaceXSmall
  },
  bundleLink: {
    display: 'inline-flex',
    fontWeight: 'normal'
  },
  cell: {
    margin: 0,
    paddingTop: theme.spaceXXSmall,
    paddingBottom: theme.spaceXXSmall,
    paddingLeft: theme.spaceXSmall,
    paddingRight: theme.spaceXSmall,
    textAlign: 'right',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: theme.colorGray
  },
  toggle: {
    color: theme.colorBlue,
    cursor: 'pointer'
  },
  footer: {
    textAlign: 'center'
  },
  footerText: {
    display: 'inline'
  }
});
