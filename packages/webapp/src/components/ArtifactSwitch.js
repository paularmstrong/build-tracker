// @flow
import Link from './Link';
import React, { PureComponent } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import theme from '../theme';
import { hsl } from 'd3-color';

export default class ArtifactSwitch extends PureComponent {
  props: {
    active: boolean,
    artifactName: string,
    color: string,
    disabled?: boolean,
    link?: string,
    onToggle: Function
  };

  render() {
    const { active, artifactName, color, disabled, link } = this.props;
    const brighterColor = hsl(color);
    brighterColor.s = 0.2;
    brighterColor.l = 0.8;

    const text = (
      <Text numberOfLines={1} style={styles.artifactNameText}>
        {artifactName}
      </Text>
    );

    return (
      <View style={[styles.artifact]}>
        <View style={styles.artifactName}>
          {link ? (
            <Link style={[styles.artifactLink]} to={link}>
              {text}
            </Link>
          ) : (
            <View style={[styles.artifactLink]}>{text}</View>
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
    this.props.onToggle(this.props.artifactName, toggled);
  };
}

const styles = StyleSheet.create({
  artifact: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  artifactName: {
    flexShrink: 1,
    justifyContent: 'center',
    paddingRight: theme.spaceXSmall
  },
  artifactLink: {
    display: 'inline-flex'
  },
  artifactNameText: {
    fontSize: theme.fontSizeSmall
  },
  switch: {
    paddingLeft: theme.spaceXSmall
  }
});
