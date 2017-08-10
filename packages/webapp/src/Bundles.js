// @flow
import { bytesToKb } from './formatting';
import { defaultStyles } from './theme';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import theme from './theme';
import { hsl } from 'd3-color';

const SizeValue = ({ bytes, label }) =>
  <Text style={styles.value}>
    {label}: {isNaN(bytes) ? '' : bytesToKb(bytes)}
  </Text>;

class Bundle extends Component {
  props: {
    active: boolean,
    bundle: string,
    color: string,
    commit: Object,
    highlight: boolean,
    onToggle: Function,
    valueAccessor: Function
  };

  render() {
    const { active, bundle, color, commit, highlight, valueAccessor } = this.props;
    const stats = commit && commit.stats[bundle];
    const brighterColor = hsl(color);
    brighterColor.s = 0.2;
    brighterColor.l = 0.8;
    return (
      <View style={highlight ? styles.bundleHighlight : styles.bundle}>
        <View style={styles.switch}>
          <Switch
            activeThumbColor={color}
            activeTrackColor={brighterColor.toString()}
            onValueChange={this._handleValueChange}
            value={active}
          />
        </View>
        <View style={styles.bundleName}>
          <Link style={defaultStyles.link} to={`/bundles/${bundle}`}>
            <Text style={styles.bundleNameText}>
              {bundle}
            </Text>
          </Link>
        </View>
        <View style={styles.values}>
          {stats ? <SizeValue bytes={valueAccessor(stats)} label="size" /> : null}
        </View>
      </View>
    );
  }

  _handleValueChange = (toggled: boolean) => {
    this.props.onToggle(this.props.bundle, toggled);
  };
}

export default class Bundles extends Component {
  props: {
    activeBundles: Array<string>,
    bundles: Array<string>,
    colorScale: Function,
    commit: Object,
    highlightBundle?: string,
    onBundlesChange: Function,
    valueAccessor: Function
  };

  render() {
    const { activeBundles, bundles, colorScale, commit, highlightBundle, valueAccessor } = this.props;

    return (
      <View>
        {bundles.map((bundle, i) =>
          <Bundle
            active={activeBundles.indexOf(bundle) !== -1}
            bundle={bundle}
            color={colorScale(bundles.length - i)}
            commit={commit}
            highlight={bundle === highlightBundle}
            key={bundle}
            onToggle={this._handleToggleBundle}
            valueAccessor={valueAccessor}
          />
        )}
      </View>
    );
  }

  _handleToggleBundle = (bundleName: string, value: boolean) => {
    const { activeBundles, onBundlesChange } = this.props;
    if (value) {
      onBundlesChange([...activeBundles, bundleName]);
    } else {
      onBundlesChange(activeBundles.filter(b => b !== bundleName));
    }
  };
}

const bundleStyle = {
  borderBottomWidth: '1px',
  borderBottomColor: theme.colorGray,
  paddingLeft: theme.spaceXSmall,
  paddingRight: theme.spaceXSmall,
  paddingTop: theme.spaceXXSmall,
  paddingBottom: theme.spaceXXSmall,
  flexDirection: 'row'
};
const styles = StyleSheet.create({
  bundle: { ...bundleStyle },
  bundleHighlight: {
    ...bundleStyle,
    backgroundColor: theme.colorGray
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
  },
  switch: {
    paddingRight: theme.spaceXXSmall
  }
});
