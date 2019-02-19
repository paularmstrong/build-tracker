import Drawer from '../Drawer';
import React from 'react';
import { shallow } from 'enzyme';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

describe('Drawer', () => {
  describe('hidden', () => {
    test('is hidden initially', () => {
      const wrapper = shallow(
        <Drawer hidden>
          <div />
        </Drawer>
      );
      expect(wrapper.find(ScrollView).prop('aria-hidden')).toBe(true);
      const styles = StyleSheet.flatten(wrapper.find(ScrollView).prop('style'));
      expect(styles).toMatchObject({ maxWidth: 300, left: -300, position: 'absolute' });
    });
  });

  describe('show', () => {
    test('makes the drawer visible', () => {
      const wrapper = shallow(
        <Drawer hidden>
          <div />
        </Drawer>
      );
      wrapper.instance().show();
      expect(wrapper.find(ScrollView).prop('aria-hidden')).toBe(false);
      const styles = StyleSheet.flatten(wrapper.find(ScrollView).prop('style'));
      expect(styles).toMatchObject({ maxWidth: 300, left: 0 });
    });
  });

  describe('scrim', () => {
    test('hides the drawer when presse3d', () => {
      const wrapper = shallow(
        <Drawer hidden>
          <div />
        </Drawer>
      );
      wrapper.instance().show();
      wrapper.find(TouchableOpacity).simulate('press');
      expect(wrapper.find(ScrollView).prop('aria-hidden')).toBe(true);
      const styles = StyleSheet.flatten(wrapper.find(ScrollView).prop('style'));
      expect(styles).toMatchObject({ maxWidth: 300, left: -300, position: 'absolute' });
    });
  });
});
