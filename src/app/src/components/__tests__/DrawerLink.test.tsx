/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import DrawerLink from '../DrawerLink';
import HeartIcon from '../../icons/Heart';
import React from 'react';
import { fireEvent, render } from 'react-native-testing-library';
import { StyleSheet, Text } from 'react-native';

describe('DrawerLink', () => {
  describe('icon', () => {
    test('does not render an icon', () => {
      const { getByType } = render(<DrawerLink href="https://build-tracker.local" text="tacos" />);
      expect(getByType(Text).props.children.props.children).toHaveLength(2);
      expect(getByType(Text).props.children.props.children).toEqual([null, 'tacos']);
    });

    test('renders the icon', () => {
      const { queryAllByType } = render(
        <DrawerLink href="https://build-tracker.local" icon={HeartIcon} text="tacos" />
      );
      expect(queryAllByType(HeartIcon)).toHaveLength(1);
    });
  });

  describe('hover', () => {
    beforeEach(() => {
      document.dispatchEvent(new Event('mousemove'));
    });

    test('adds a bg color', () => {
      const { getByProps } = render(<DrawerLink href="https://build-tracker.local" text="tacos" />);
      const root = getByProps({ accessibilityRole: 'link' });
      expect(StyleSheet.flatten(root.props.style)).not.toMatchObject({
        backgroundColor: expect.any(String)
      });
      fireEvent(root, 'mouseEnter');
      expect(StyleSheet.flatten(root.props.style)).toMatchObject({
        backgroundColor: Theme.Color.Primary00
      });
    });

    test('changes font color', () => {
      const { getByType } = render(<DrawerLink href="https://build-tracker.local" text="tacos" />);
      const root = getByType(Text);
      expect(StyleSheet.flatten(root.props.style)).not.toMatchObject({
        color: expect.any(String)
      });
      fireEvent(root, 'mouseEnter');
      expect(StyleSheet.flatten(root.props.style)).toMatchObject({
        color: Theme.Color.Primary40
      });
    });
  });
});
