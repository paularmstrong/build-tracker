import { bytesToKb, formatSha } from './formatting';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

const getBundles = builds =>
  builds
    .reduce((memo, commit) => {
      const bundles = Object.keys(commit.stats);
      return memo.concat(bundles).filter((value, index, self) => self.indexOf(value) === index);
    }, [])
    .sort();

class BuildHeader extends PureComponent {
  render() {
    return <th />;
  }
}

export default class Comparisons extends PureComponent {
  props: {
    builds: Array<Object>,
    valueAccessor: Function
  };

  render() {
    const { builds, valueAccessor } = this.props;
    const bundles = getBundles(builds);
    return (
      <table>
        <thead>
          <tr>
            <th />
            {builds.map(build =>
              <th key={build.build.revision}>
                {formatSha(build.build.revision)}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {bundles.map(bundle =>
            <tr key={bundle}>
              <th>
                {bundle}
              </th>
              {builds.map(build =>
                <td key={build.build.revision}>
                  {bytesToKb(valueAccessor(build.stats[bundle]))}
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}
