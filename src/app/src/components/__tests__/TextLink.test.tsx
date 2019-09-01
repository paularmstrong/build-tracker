/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import React from 'react';
import { StyleSheet } from 'react-native';
import TextLink from '../TextLink';
import { fireEvent, render } from 'react-native-testing-library';

describe('TextLink', () => {
  describe('hover', () => {
    beforeEach(() => {
      document.dispatchEvent(new Event('mousemove'));
    });

    test('changes the bg color', () => {
      const { getByProps } = render(<TextLink href="https://build-tracker.local" text="tacos" />);
      const root = getByProps({ accessibilityRole: 'link' });
      expect(StyleSheet.flatten(root.props.style)).not.toMatchObject({
        backgroundColor: expect.any(String)
      });
      fireEvent(root, 'mouseEnter');
      expect(StyleSheet.flatten(root.props.style)).toMatchObject({
        backgroundColor: Theme.Color.Primary00
      });
    });
  });
});
