// @flow
import { defaultStyles } from './theme';
import { Link } from 'react-router-dom';
import React, { Component, PureComponent } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import theme from './theme';
import { hsl } from 'd3-color';

class Bundle extends PureComponent {
  props: {
    active: boolean,
    bundle: string,
    color: string,
    highlight: boolean,
    onToggle: Function
  };

  render() {
    const { active, bundle, color, highlight } = this.props;
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
            <Text numberOfLines={1} style={styles.bundleNameText}>
              {bundle}
            </Text>
          </Link>
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
        <View style={styles.header}>
          <View style={styles.switch}>
            <Switch
              disabled={viewingAll}
              onValueChange={this._handleToggleAllBundles}
              thumbColor={theme.colorBlue}
              value={viewingAll}
            />
          </View>
          <View style={styles.bundleName}>
            <Text role="heading" style={styles.bundleNameText}>
              All Bundles
            </Text>
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

const bundleStyle = {
  borderBottomWidth: '1px',
  borderBottomColor: theme.colorGray,
  paddingLeft: theme.spaceXSmall,
  paddingRight: theme.spaceXSmall,
  paddingTop: theme.spaceXXSmall,
  paddingBottom: theme.spaceXXSmall,
  flexDirection: 'row',
  overflow: 'hidden'
};

const styles = StyleSheet.create({
  bundle: { ...bundleStyle },
  bundleHighlight: {
    ...bundleStyle,
    backgroundColor: theme.colorGray
  },
  bundleName: {
    flexShrink: 1,
    flexGrow: 1
  },
  bundleNameText: {
    fontSize: theme.fontSizeSmall
  },
  header: {
    ...bundleStyle,
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorWhite,
    zIndex: 1
  },
  switch: {
    paddingRight: theme.spaceXXSmall
  }
});
