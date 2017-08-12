import Link from './Link';
import theme from './theme';
import { bytesToKb, formatSha } from './formatting';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Table, Thead, Tbody, Tr, Th, Td } from './Table';
import { scaleLinear } from 'd3-scale';
import { interpolateHcl } from 'd3-interpolate';
import { rgb } from 'd3-color';

import type { Build } from './types';

const emptyObject = {};

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
    const headers = [revision];
    if (i > 0) {
      headers.push('𝚫');
    }
    if (i > 1) {
      headers.push('𝚫0');
    }
    return headers;
  });

const getTableBody = (bundles: Array<string>, builds: Array<Build>, valueAccessor: Function) => {
  const bundleMap = bundles.map((bundle, i) => {
    const originalValue = valueAccessor(builds[0].stats[bundle]);
    return [
      bundle,
      ...builds.map((build, i) => {
        const value = valueAccessor(build.stats[bundle]);
        if (i === 0) {
          return { bytes: value };
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
      return { bytes: total };
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
    head: [null, ...getTableHeaders(builds)],
    body: getTableBody(bundles, builds, valueAccessor)
  };
};

class Heading extends PureComponent {
  props: {
    onClick?: Function,
    text: string
  };

  static defaultProps = {
    text: ''
  };

  render() {
    const { onClick, text } = this.props;
    return (
      <Th style={styles.header}>
        {text && onClick
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
    color: string
  };

  render() {
    const { bundle, color } = this.props;
    const isAll = this._isAll();
    return (
      <Th style={[styles.cell, styles.rowHeader]}>
        <Link style={[styles.bundleLink]} to={`/${isAll ? '' : bundle}`}>
          {bundle}
        </Link>
        <View style={[styles.rowColor, { backgroundColor: !isAll && color }]} />
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
    onClickRemove?: Function,
    valueAccessor: Function
  };

  render() {
    const { builds, bundles, colorScale, onClickRemove, valueAccessor } = this.props;
    if (!builds.length) {
      return null;
    }
    const data = createTableData(bundles, builds, valueAccessor);
    return (
      <Table style={styles.dataTable}>
        <Thead>
          <Tr>
            {data.head.map((value, i) => {
              if (Array.isArray(value)) {
                return value.map((col, j) =>
                  <Heading key={`${i}-${j}`} onClick={j === 0 ? onClickRemove : undefined} text={col} />
                );
              }
              return <Heading key={i} onClick={onClickRemove} text={value} />;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {builds.length
            ? data.body.map((row, i) => {
                const deltas = row.filter(value => Array.isArray(value) && Math.abs(value[1].bytes) > 100);
                if (i !== 0 && row.length > 2 && deltas.length === 0) {
                  return null;
                }
                return (
                  <Tr key={i}>
                    {row.map((col, i) => {
                      if (i === 0) {
                        return <BundleCell bundle={col} color={colorScale(1 - bundles.indexOf(col))} key={i} />;
                      }
                      const colSpan = data.head[i].length;
                      if (Array.isArray(col)) {
                        const innerColSpan = col.length === colSpan ? 1 : colSpan;
                        return col.map((v, j) => <ValueCell {...v} colSpan={innerColSpan} key={`${i}-${j}`} />);
                      }
                      return <ValueCell {...col} colSpan={colSpan} key={i} />;
                    })}
                  </Tr>
                );
              })
            : null}
        </Tbody>
      </Table>
    );
  }
}

const styles = StyleSheet.create({
  dataTable: {
    fontSize: theme.fontSizeSmall,
    borderSpacing: 0,
    borderCollapse: 'collapse',
    marginLeft: theme.spaceMedium,
    marginRight: theme.spaceMedium,
    marginBottom: theme.spaceMedium
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
  header: {}
});
