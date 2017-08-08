// @flow
import { defaultStyles } from './theme';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { bundles, statsForBundle } from './stats';

const SizeValue = ({ bytes, label }) =>
  <Text style={styles.value}>
    {label}: {bytes}
  </Text>;

class Bundle extends Component {
  props: {
    bundle: String,
    date: Object
  };

  render() {
    const { bundle } = this.props;
    const stats = this.stats.stats[bundle];
    return (
      <View>
        <Link style={defaultStyles.link} to={`/bundles/${bundle}`}>
          {bundle}
        </Link>
        <View style={styles.values}>
          {stats ? <SizeValue bytes={stats.size} label="stat" /> : null}
          {stats ? <SizeValue bytes={stats.gzipSize} label="gzip" /> : null}
        </View>
      </View>
    );
  }

  get stats() {
    const { bundle, date } = this.props;
    return statsForBundle(bundle).find(commit => commit.build.timestamp === date) || { build: {}, stats: {} };
  }
}

export default class Bundles extends Component {
  props: {
    date: Object
  };

  render() {
    const { date } = this.props;
    return (
      <View>
        {bundles.sort().map(bundle => <Bundle bundle={bundle} date={date} key={bundle} />)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  values: {
    flexDirection: 'row'
  },
  value: {
    flexGrow: 1,
    fontSize: '0.7em'
  }
});
