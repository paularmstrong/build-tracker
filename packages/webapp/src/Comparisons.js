import theme from './theme';
import { bytesToKb, formatSha } from './formatting';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Table, Thead, Tbody, Tr, Th, Td } from './Table';
import { scaleLinear } from 'd3-scale';
import { interpolateHcl } from 'd3-interpolate';
import { rgb } from 'd3-color';

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

const getBundles = builds =>
  builds
    .reduce((memo, commit) => {
      const bundles = Object.keys(commit.stats);
      return memo.concat(bundles).filter((value, index, self) => self.indexOf(value) === index);
    }, [])
    .sort();

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

const getTableBody = (bundles: Array<string>, builds: Array<Object>, valueAccessor: Function) => {
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

const getTotals = (builds: Array<Object>, valueAccessor: Function) => {
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

const createTableData = (bundles: Array<string>, builds: Array<Object>, valueAccessor: Function) => {
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
      <Th>
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

class Value extends PureComponent {
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
      <Td colSpan={colSpan} style={color ? { backgroundColor: color } : emptyObject}>
        {bytesToKb(bytes)}
      </Td>
    );
  }
}

export default class Comparisons extends PureComponent {
  props: {
    builds: Array<Object>,
    onClickRemove?: Function,
    valueAccessor: Function
  };

  render() {
    const { builds, onClickRemove, valueAccessor } = this.props;
    const bundles = getBundles(builds);
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
              } else {
                return <Heading key={i} onClick={onClickRemove} text={value} />;
              }
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
                        return (
                          <Th key={i} style={styles.bundleName}>
                            {col}
                          </Th>
                        );
                      }
                      const colSpan = data.head[i].length;
                      if (Array.isArray(col)) {
                        const innerColSpan = col.length === colSpan ? 1 : colSpan;
                        return col.map((v, j) => <Value {...v} colSpan={innerColSpan} key={`${i}-${j}`} />);
                      }
                      return <Value {...col} colSpan={colSpan} key={i} />;
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
    fontSize: theme.fontSizeSmall
  },
  bundleName: {
    textAlign: 'right'
  }
});
