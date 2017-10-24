// @flow
import Link from './Link';
import React, { PureComponent } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import theme from '../theme';
import { hsl } from 'd3-color';

export default class BundleSwitch extends PureComponent {
  props: {
    active: boolean,
    bundleName: string,
    color: string,
    disabled?: boolean,
    link?: string,
    onToggle: Function
  };

  render() {
    const { active, bundleName, color, disabled, link } = this.props;
    const brighterColor = hsl(color);
    brighterColor.s = 0.2;
    brighterColor.l = 0.8;

    const text = (
      <Text numberOfLines={1} style={styles.bundleNameText}>
        {bundleName}
      </Text>
    );

    return (
      <View style={[styles.bundle]}>
        <View style={styles.bundleName}>
          {link ? (
            <Link style={[styles.bundleLink]} to={link}>
              {text}
            </Link>
          ) : (
            <View style={[styles.bundleLink]}>{text}</View>
          )}
        </View>
        <View style={styles.switch}>
          <Switch
            activeThumbColor={color}
            activeTrackColor={brighterColor.toString()}
            disabled={disabled}
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
