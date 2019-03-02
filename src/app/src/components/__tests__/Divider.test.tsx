/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import Divider from '../Divider';
import React from 'react';
import { render } from 'react-native-testing-library';
import { StyleSheet, View } from 'react-native';

describe('Divider', () => {
  test('renders a simple divider', () => {
    const { getByType } = render(<Divider />);
    expect(StyleSheet.flatten(getByType(View).props.style)).toMatchObject({ backgroundColor: Theme.Color.Gray20 });
  });

  test('renders a divider with the given color', () => {
    const { getByType } = render(<Divider color="red" />);
    expect(StyleSheet.flatten(getByType(View).props.style)).toMatchObject({ backgroundColor: 'red' });
  });
});
