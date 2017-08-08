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
    bundle: string,
    commit: Object
  };

  render() {
    const { bundle, commit } = this.props;
    const stats = commit && commit.stats[bundle];
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
}

export default class Bundles extends Component {
  props: {
    commit: Object
  };

  render() {
    const { commit } = this.props;
    return (
      <View>
        {bundles.sort().map(bundle => <Bundle bundle={bundle} commit={commit} key={bundle} />)}
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
    flexDirection: 'row'
  },
  value: {
    flexGrow: 1,
    fontSize: '0.7em',
    color: theme.colorBlack
  }
});
