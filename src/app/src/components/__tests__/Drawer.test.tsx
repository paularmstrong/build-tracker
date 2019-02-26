/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Drawer from '../Drawer';
import React from 'react';
import { fireEvent, render } from 'react-native-testing-library';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

describe('Drawer', () => {
  describe('hidden', () => {
    test('is hidden initially', () => {
      const { getByType } = render(
        <Drawer hidden>
          <div />
        </Drawer>
      );
      expect(getByType(ScrollView).props['aria-hidden']).toBe(true);
      const styles = StyleSheet.flatten(getByType(ScrollView).props.style);
      expect(styles).toMatchObject({ maxWidth: 300, left: -300, position: 'absolute' });
    });
  });

  describe('show', () => {
    test('makes the drawer visible', () => {
      const { getByType } = render(
        <Drawer hidden>
          <div />
        </Drawer>
      );
      getByType(Drawer).instance.show();
      expect(getByType(ScrollView).props['aria-hidden']).toBe(false);
      const styles = StyleSheet.flatten(getByType(ScrollView).props.style);
      expect(styles).toMatchObject({ maxWidth: 300, left: 0 });
    });
  });

  describe('scrim', () => {
    test('hides the drawer when presse3d', () => {
      const { getByType } = render(
        <Drawer hidden>
          <div />
        </Drawer>
      );
      getByType(Drawer).instance.show();
      fireEvent.press(getByType(TouchableOpacity));
      expect(getByType(ScrollView).props['aria-hidden']).toBe(true);
      const styles = StyleSheet.flatten(getByType(ScrollView).props.style);
      expect(styles).toMatchObject({ maxWidth: 300, left: -300, position: 'absolute' });
    });
  });
});
