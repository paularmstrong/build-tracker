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
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </g>
  );

Menu.metadata = { height: 24, width: 24 };

export default Menu;
