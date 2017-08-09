// @flow
import { bytesToKb } from './formatting';
import { defaultStyles } from './theme';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from './theme';

const SizeValue = ({ bytes, label }) =>
  <Text style={styles.value}>
    {label}: {isNaN(bytes) ? '' : bytesToKb(bytes)}
  </Text>;

class Bundle extends Component {
  props: {
    bundle: string,
    color: string,
    commit: Object
  };

  render() {
    const { bundle, color, commit } = this.props;
    const stats = commit && commit.stats[bundle];
    return (
      <Link style={defaultStyles.link} to={`/bundles/${bundle}`}>
        <View style={styles.bundle}>
          <View style={{ ...colorStyles, backgroundColor: color }}>&nbsp;</View>
          <View style={styles.bundleName}>
            <Text style={styles.bundleNameText}>
              {bundle}
            </Text>
          </View>
          <View style={styles.values}>
            {<SizeValue bytes={stats && stats.size} label="stat" />}
            {<SizeValue bytes={stats && stats.gzipSize} label="gzip" />}
          </View>
        </View>
      </Link>
    );
  }
}

export default class Bundles extends Component {
  props: {
    bundles: Array<string>,
    colorScale: Function,
    commit: Object
  };

  render() {
    const { bundles, colorScale, commit } = this.props;
    return (
      <View>
        {bundles
          .sort()
          .map((bundle, i) => <Bundle bundle={bundle} color={colorScale(i)} commit={commit} key={bundle} />)}
      </View>
    );
  }
}

const colorStyles = {
  width: '1rem',
  flexGrow: 0,
  flexShrink: 0,
  height: '100%',
  marginRight: '0.5rem'
};

const styles = StyleSheet.create({
  bundle: {
    borderBottomWidth: '1px',
    borderBottomColor: theme.colorGray,
    paddingLeft: theme.spaceXSmall,
    paddingRight: theme.spaceXSmall,
    paddingTop: theme.spaceXXSmall,
    paddingBottom: theme.spaceXXSmall,
    flexDirection: 'row'
  },
  bundleName: {
    flexGrow: 1
  },
  bundleNameText: {
    fontSize: theme.fontSizeSmall
  },
  values: {
    flexGrow: 0,
    flexShrink: 0,
    minWidth: '25%'
  },
  value: {
    flexGrow: 1,
    fontSize: '0.7em',
    color: theme.colorBlack
  }
});
