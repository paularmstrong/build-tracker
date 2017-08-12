// @flow
import { Component } from 'react';
import { createDOMElement, StyleSheet } from 'react-native';
import { Link as ReactRouterLink } from 'react-router-dom';
import theme from './theme';

export default class Link extends Component {
  render() {
    return createDOMElement(ReactRouterLink, {
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
