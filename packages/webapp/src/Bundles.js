// @flow
import { defaultStyles } from './theme';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { bundles, statsForBundle } from './stats';
import theme from './theme';

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
      <View style={styles.bundle}>
        <Link style={defaultStyles.link} to={`/bundles/${bundle}`}>
          <Text style={styles.bundleName}>
            {bundle}
          </Text>
          <View style={styles.values}>
            {stats ? <SizeValue bytes={stats.size} label="stat" /> : null}
            {stats ? <SizeValue bytes={stats.gzipSize} label="gzip" /> : null}
          </View>
        </Link>
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
  bundle: {
    borderBottomWidth: '1px',
    borderBottomColor: theme.colorGray,
    paddingLeft: theme.spaceXSmall,
    paddingRight: theme.spaceXSmall,
    paddingTop: theme.spaceXXSmall,
    paddingBottom: theme.spaceXXSmall
  },
  bundleName: {
    fontSize: theme.fontSizeSmall
  },
  values: {
    flexDirection: 'row',
    color: theme.colorBlack
  },
  value: {
    flexGrow: 1,
    fontSize: '0.7em'
  }
});
