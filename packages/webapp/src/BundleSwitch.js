// @flow
import Link from './Link';
import React, { PureComponent } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import theme from './theme';
import { hsl } from 'd3-color';

export default class BundleSwitch extends PureComponent {
  props: {
    active: boolean,
    bundleName: string,
    color: string,
    highlight?: boolean,
    link: string,
    onToggle: Function
  };

  render() {
    const { active, bundleName, color, highlight, link } = this.props;
    const brighterColor = hsl(color);
    brighterColor.s = 0.2;
    brighterColor.l = 0.8;

    return (
      <View style={[styles.bundle, highlight && styles.bundleHighlight]}>
        <View style={styles.bundleName}>
          <Link style={[styles.bundleLink]} to={link}>
            <Text numberOfLines={1} style={styles.bundleNameText}>
              {bundleName}
            </Text>
          </Link>
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
    );
  }

  _handleValueChange = (toggled: boolean) => {
    this.props.onToggle(this.props.bundleName, toggled);
  };
}

const styles = StyleSheet.create({
  bundle: {
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
  switch: {
    paddingLeft: theme.spaceXSmall
  }
});
