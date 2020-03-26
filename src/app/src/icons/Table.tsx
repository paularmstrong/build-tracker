/**
 * Material design redistributed from https://github.com/google/material-design-icons
 *
 * SVG contents redistributed under Apache License 2.0:
 * https://github.com/google/material-design-icons/blob/master/LICENSE
 * Copyright 2015 Google, Inc. All Rights Reserved.
 */
import React from 'react';
import styles from './styles';
import { StyleProp, TextStyle, unstable_createElement, ViewProps } from 'react-native';

interface Props extends ViewProps {
  style?: StyleProp<TextStyle>;
}

const Table = (props: Props): React.ReactElement<Props> =>
  unstable_createElement(
    'svg',
    {
      ...props,
      style: [styles.root, props.style],
      viewBox: '0 0 24 24',
    },
    <g>
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10H3v9z" />
    </g>
  );

Table.metadata = { height: 24, width: 24 };

export default Table;
