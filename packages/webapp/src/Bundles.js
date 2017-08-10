// @flow
import { bytesToKb } from './formatting';
import Link from './Link';
import React, { Component, PureComponent } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import theme from './theme';
import { hsl } from 'd3-color';

const SizeValue = ({ bytes, label }) =>
  <Text style={styles.value}>
    {label ? `${label}: ` : null}
    {isNaN(bytes) ? '' : bytesToKb(bytes)}
  </Text>;

class Bundle extends PureComponent {
  props: {
    active: boolean,
    bundle: string,
    color: string,
    highlight: boolean,
    onToggle: Function,
    size?: string
  };

  render() {
    const { active, bundle, color, highlight, size } = this.props;
    const brighterColor = hsl(color);
    brighterColor.s = 0.2;
    brighterColor.l = 0.8;
    return (
      <View style={[ styles.bundle, highlight && styles.bundleHighlight ]}>
        <View style={styles.bundleName}>
          <Link style={[styles.bundleLink]} to={`/bundles/${bundle}`}>
            <Text numberOfLines={1} style={styles.bundleNameText}>
              {bundle}
            </Text>
          </Link>
        </View>
        <View style={styles.bundleDetails}>
          <View style={styles.values}>
            {size ? <SizeValue bytes={size} /> : null}
          </View>
          <View style={styles.switch}>
            <Switch
              activeThumbColor={color}
              activeTrackColor={brighterColor.toString()}
              onValueChange={this._handleValueChange}
              value={active}
            />
          </View>
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

    const viewingAll = activeBundles.length === bundles.length;
    return (
      <View>
        <View style={[ styles.bundle, styles.header ]}>
          <View style={styles.bundleName}>
            <Text role="heading" style={styles.bundleNameText}>
              All Bundles
            </Text>
          </View>
          <View style={styles.switch}>
            <Switch
              disabled={viewingAll}
              onValueChange={this._handleToggleAllBundles}
              thumbColor={theme.colorBlue}
              value={viewingAll}
            />
          </View>
        </View>
        {bundles.map((bundle, i) =>
          <Bundle
            active={activeBundles.indexOf(bundle) !== -1}
            bundle={bundle}
            color={colorScale(bundles.length - i)}
            commit={commit}
            highlight={bundle === highlightBundle}
            key={bundle}
            onToggle={this._handleToggleBundle}
            size={commit && commit.stats && commit.stats[bundle] && valueAccessor(commit.stats[bundle])}
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

  _handleToggleAllBundles = (value: boolean) => {
    const { bundles, onBundlesChange } = this.props;
    onBundlesChange(bundles);
  };
}

const styles = StyleSheet.create({
  bundle: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colorGray,
    paddingLeft: theme.spaceXSmall,
    paddingRight: theme.spaceXSmall,
    paddingTop: theme.spaceXXSmall,
    paddingBottom: theme.spaceXXSmall,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bundleHighlight: {
    backgroundColor: theme.colorGray
  },
  bundleName: {
    flexShrink: 1,
    justifyContent: 'center',
    paddingRight: theme.spaceXSmall
  },
  bundleLink: {
    display: 'inline-flex'
  },
  bundleNameText: {
    fontSize: theme.fontSizeSmall
  },
  bundleDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorWhite,
    zIndex: 1
  },
  value: {
    flexGrow: 1,
    fontSize: '0.7em',
    color: theme.colorBlack
  },
  switch: {
    paddingLeft: theme.spaceXSmall
  }
});
