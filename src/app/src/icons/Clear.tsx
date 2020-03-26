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

const Clear = (props: Props): React.ReactElement<Props> =>
  unstable_createElement(
    'svg',
    {
      ...props,
      style: [styles.root, props.style],
      viewBox: '0 0 24 24',
    },
    <g>
      <path d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </g>
  );

Clear.metadata = { height: 24, width: 24 };

export default Clear;
