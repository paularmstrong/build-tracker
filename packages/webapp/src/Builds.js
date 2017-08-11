import { bytesToKb } from './formatting';
import { timeFormat } from 'd3-time-format';
import React, { Component, PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

const formatTime = timeFormat('%Y-%m-%d %H:%M');

class Build extends PureComponent {
  props: {
    build: Object,
    onRemove?: Function,
    valueAccessor: Function
  };

  render() {
    const { build, onRemove, valueAccessor } = this.props;
    const totalSize = Object.values(build.stats).reduce((memo, bundle) => memo + valueAccessor(bundle), 0);

    return (
      <View style={styles.build}>
        <table>
          <tbody>
            {Object.entries(build.build).map(([key, value]) =>
              <tr key={key}>
                <th>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </th>
                <td>
                  {key === 'timestamp' ? formatTime(value) : value}
                </td>
              </tr>
            )}
            <tr>
              <th>Total Size</th>
              <td>
                {bytesToKb(totalSize)}
              </td>
            </tr>
          </tbody>
        </table>
      </View>
    );
  }
}

export default class Builds extends PureComponent {
  props: {
    builds: Array<Object>,
    onRemoveBuild?: Function,
    previewBuild?: Object,
    valueAccessor: Function
  };

  render() {
    const { builds, onRemoveBuild, previewBuild, valueAccessor } = this.props;
    const sortedBuilds = builds
      .sort((a, b) => a.build.timestamp - b.build.timestamp)
      .filter(b => !previewBuild || b.build.revision !== previewBuild.build.revision);
    return (
      <View style={styles.builds}>
        {sortedBuilds.map((build, i) =>
          <Build build={build} key={i} onRemove={onRemoveBuild} valueAccessor={valueAccessor} />
        )}
        {previewBuild ? <Build build={previewBuild} valueAccessor={valueAccessor} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  builds: {
    flexDirection: 'row',
    overflowY: 'auto'
  },
  build: {
    flexGrow: 1,
    maxWidth: '50%',
    minWidth: '30%'
  }
});
