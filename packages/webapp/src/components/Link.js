// @flow
import { Component } from 'react';
import { createElement, StyleSheet } from 'react-native';
import { Link as ReactRouterLink } from 'react-router-dom';
import theme from '../theme';

type LinkProps = {
  style: mixed
};

export default class Link extends Component<LinkProps> {
  render() {
    return createElement(ReactRouterLink, {
      ...this.props,
      style: [styles.link, this.props.style]
    });
  }
}

const styles = StyleSheet.create({
  link: {
    color: theme.colorBlue,
    textDecorationLine: 'none'
  }
});
