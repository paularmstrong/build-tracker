// @flow
import { hsl } from 'd3-color';
import Link from './Link';
import React, { PureComponent } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import theme from '../theme';
import { withRouter } from 'react-router-dom';

import type { Match } from 'react-router-dom';

export type Props = {
  active: boolean,
  artifactName: string,
  color: string,
  disabled?: boolean,
  linked?: boolean,
  match?: Match,
  onToggle: Function
};

class ArtifactSwitch extends PureComponent<Props> {
  static defaultProps = {
    disabled: false,
    linked: false
  };

  render() {
    const { active, artifactName, color, disabled, linked } = this.props;
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
          {linked ? (
            <Link style={[styles.artifactLink]} to={this.link}>
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

  get link() {
    const { artifactName, match } = this.props;
    const { params } = match || {};
    const revisionPrefix = params.revisions ? `/revisions/${params.revisions}` : '';
    const compareSuffix = params.compareRevisions ? `/${params.compareRevisions}` : '';
    return `${revisionPrefix}/${artifactName}${compareSuffix}`;
  }
}

export default withRouter(ArtifactSwitch);

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
