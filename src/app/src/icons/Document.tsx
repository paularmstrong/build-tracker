/**
 * Material design redistributed from https://github.com/google/material-design-icons
 *
 * SVG contents redistributed under Apache License 2.0:
 * https://github.com/google/material-design-icons/blob/master/LICENSE
 * Copyright 2015 Google, Inc. All Rights Reserved.
 */
import React from 'react';
import styles from './styles';
import { createElement, StyleProp, TextStyle, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle & TextStyle>;
}

const Document = (props: Props): React.ReactElement<Props> =>
  createElement(
    'svg',
    {
      ...props,
      style: [styles.root, props.style],
      viewBox: '0 0 24 24'
    },
    <g>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </g>
  );

Document.metadata = { height: 24, width: 24 };

export default Document;
