// @flow
import { Component } from 'react';
import { createElement, StyleSheet } from 'react-native';
import { Link as ReactRouterLink, withRouter } from 'react-router-dom';
import theme from '../theme';

import type { Match } from 'react-router-dom';

class Link extends Component {
  props: {
    match: Match,
    style: any,
    to: string
  };

  render() {
    const { match: { params: { revisions } }, to } = this.props;
    const normalizedTo = revisions ? `/revisions/${revisions}${to}` : to;
    return createElement(ReactRouterLink, {
      ...this.props,
      style: [styles.link, this.props.style],
      to: normalizedTo
    });
  }
}

export default withRouter(Link);

const styles = StyleSheet.create({
  link: {
    color: theme.colorBlue,
    textDecorationLine: 'none'
  }
});
