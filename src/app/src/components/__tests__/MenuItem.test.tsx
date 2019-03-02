/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import MenuIcon from '../../icons/Menu';
import MenuItem from '../MenuItem';
import React from 'react';
import Ripple from '../Ripple';
import { StyleSheet } from 'react-native';
import uuid from 'uuid';
import { fireEvent, render } from 'react-native-testing-library';

describe('MenuItem', () => {
  describe('icon', () => {
    test('renders and icon, labeled by the text', () => {
      jest.spyOn(uuid, 'v4').mockReturnValue('12345');
      const { queryAllByProps } = render(<MenuItem icon={MenuIcon} label="tacos" />);
      // This ends up as 2 because it spreads to the Icon and the SVG
      expect(queryAllByProps({ 'aria-labelledby': '12345' })).toHaveLength(2);
    });

    test('does not render an icon', () => {
      jest.spyOn(uuid, 'v4').mockReturnValue('23456');
      const { queryAllByProps } = render(<MenuItem label="tacos" />);
      expect(queryAllByProps({ 'aria-labelledby': '23456' })).toHaveLength(0);
    });
  });

  describe('hovering', () => {
    beforeEach(() => {
      // reset to no hover available
      document.dispatchEvent(new Event('mousemove'));
    });

    test('sets hover styles', () => {
      const { getByType } = render(<MenuItem label="tacos" nativeID="tacos" />);
      fireEvent(getByType(Ripple), 'mouseEnter');
      expect(StyleSheet.flatten(getByType(Ripple).props.style)).toMatchObject({
        backgroundColor: 'rgba(0,0,0,0.1)'
      });

      fireEvent(getByType(Ripple), 'mouseLeave');
      expect(StyleSheet.flatten(getByType(Ripple).props.style)).not.toMatchObject({
        backgroundColor: 'rgba(0,0,0,0.1)'
      });
    });

    test('sets icon hover styles', () => {
      const { getByType } = render(<MenuItem icon={MenuIcon} label="tacos" nativeID="tacos" />);
      fireEvent(getByType(Ripple), 'mouseEnter');
      expect(StyleSheet.flatten(getByType(MenuIcon).props.style)).toMatchObject({
        color: Theme.Color.Gray40
      });

      fireEvent(getByType(Ripple), 'mouseLeave');
      expect(StyleSheet.flatten(getByType(MenuIcon).props.style)).toMatchObject({
        color: Theme.Color.Gray30
      });
    });
  });

  describe('onPress', () => {
    test('passes through', () => {
      const handlePress = jest.fn();
      const { getByProps } = render(<MenuItem label="tacos" nativeID="tacotaco" onPress={handlePress} />);
      fireEvent.press(getByProps({ nativeID: 'tacotaco' }));
      expect(handlePress).toHaveBeenCalled();
    });
  });
});
