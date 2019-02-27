import React from 'react';
import styles from './styles';
import { createElement, StyleProp, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
}

const Menu = (props: Props): React.ReactElement<Props> =>
  createElement(
    'svg',
    {
      ...props,
      style: [styles.root, props.style],
      viewBox: '0 0 24 24'
    },
    <g>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </g>
  );

Menu.metadata = { height: 24, width: 24 };

export default Menu;
