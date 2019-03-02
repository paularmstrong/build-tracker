/**
 * Material design redistributed from https://github.com/google/material-design-icons
 *
 * SVG contents redistributed under Apache License 2.0:
 * https://github.com/google/material-design-icons/blob/master/LICENSE
 * Copyright 2015 Google, Inc. All Rights Reserved.
 */
import React from 'react';
import styles from './styles';
import { createElement, StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle & TextStyle>;
}

const Heart = (props: Props & ViewProps): React.ReactElement<Props> =>
  createElement(
    'svg',
    {
      ...props,
      style: [styles.root, props.style],
      viewBox: '0 0 24 24'
    },
    <g>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </g>
  );

Heart.metadata = { height: 24, width: 24 };

export default Heart;
