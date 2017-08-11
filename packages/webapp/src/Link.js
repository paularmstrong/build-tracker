import { Component } from 'react';
import { createDOMElement } from 'react-native-web';
import { Link as ReactRouterLink } from 'react-router-dom';
import { StyleSheet } from 'react-native';
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
