import { bytesToKb, formatSha, formatTime } from './formatting';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

const getBundles = builds =>
  builds
    .reduce((memo, commit) => {
      const bundles = Object.keys(commit.stats);
      return memo.concat(bundles).filter((value, index, self) => self.indexOf(value) === index);
    }, [])
    .sort();

const getTableHeaders = builds =>
  builds.map((build, i) => {
    const { revision, timestamp } = build.build;
    const headers = [formatSha(revision)];
    if (i > 0) {
      headers.push('𝚫');
    }
    if (i > 1) {
      headers.push('𝚫𝚫');
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
          return value;
        }
        const oldValue = valueAccessor(builds[i - 1].stats[bundle]);
        const delta = oldValue - value;
        const values = [value, delta];
        if (i > 1) {
          values.push(originalValue - value);
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
      return total;
    }
    const values = [total, totals[0] - total];
    if (i > 1) {
      values.push(totals[i - 1] - total);
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

export default class Comparisons extends PureComponent {
  props: {
    builds: Array<Object>,
    valueAccessor: Function
  };

  render() {
    const { builds, valueAccessor } = this.props;
    const bundles = getBundles(builds);
    const data = createTableData(bundles, builds, valueAccessor);
    return (
      <table>
        <thead>
          <tr>
            {data.head.map(value => {
              if (Array.isArray(value)) {
                return value.map(col =>
                  <th>
                    {col}
                  </th>
                );
              } else {
                return (
                  <th>
                    {value}
                  </th>
                );
              }
            })}
          </tr>
        </thead>
        <tbody>
          {builds.length
            ? data.body.map((row, i) => {
                const deltas = row.filter(value => Array.isArray(value) && Math.abs(value[1]) > 100);
                if (i !== 0 && row.length > 2 && deltas.length === 0) {
                  return null;
                }
                return (
                  <tr>
                    {row.map((col, i) => {
                      if (i === 0) {
                        return (
                          <th>
                            {col}
                          </th>
                        );
                      }
                      const colSpan = data.head[i].length;
                      if (Array.isArray(col)) {
                        const innerColSpan = col.length === colSpan ? 1 : colSpan;
                        return col.map(v =>
                          <td colSpan={innerColSpan}>
                            {bytesToKb(v)}
                          </td>
                        );
                      }
                      return (
                        <td colSpan={colSpan}>
                          {bytesToKb(col)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    );
  }
}
