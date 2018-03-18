// @flow
import Hoverable from '../Hoverable';
import { Link as ReactRouterLink } from 'react-router-dom';
import theme from '../../theme';
import { createElement, StyleSheet } from 'react-native';
import React, { Component } from 'react';

type LinkProps = React$ElementConfig<typeof Link> & {
  style?: mixed,
  styleHovered?: mixed
};

class ExternalLink extends Component<LinkProps> {
  render() {
    const { to: href, ...props } = this.props;
    return createElement('a', {
      ...props,
      href,
      rel: 'nofollow noopener',
      target: '_blank'
    });
  }
}

export class Link extends Component<LinkProps> {
  render() {
    const { to } = this.props;
    return (
      <Hoverable>
        {isHovered =>
          createElement(typeof to === 'string' && /^https?:\/\//.test(to) ? ExternalLink : ReactRouterLink, {
            ...this.props,
            style: [
              styles.link,
              isHovered && styles.linkHovered,
              this.props.style,
              isHovered && this.props.styleHovered
            ]
          })
        }
      </Hoverable>
    );
  }
}
export default Link;

const styles = StyleSheet.create({
  link: {
    cursor: 'pointer',
    color: theme.colorBlue,
    textDecorationLine: 'none'
  },
  linkHovered: {
    color: theme.colorGreen
  }
});
