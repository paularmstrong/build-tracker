// @flow
import { Component } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import theme from '../theme';
import { createElement, StyleSheet } from 'react-native';

type Props = {
  style: mixed
};

export default class Link extends Component<Props> {
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
