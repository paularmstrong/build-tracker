import React from 'react';
import Ripple from '../Ripple';
import { shallow } from 'enzyme';
import { StyleSheet, View } from 'react-native';

describe('Ripple', () => {
  describe('layout', () => {
    test('gets the width and height via onLayou', () => {
      const wrapper = shallow(
        <Ripple>
          <div />
        </Ripple>
      );

      const mockLayoutEvent = { nativeEvent: { layout: { width: 400, height: 300 } } };
      wrapper
        .find(View)
        .first()
        .simulate('layout', mockLayoutEvent);
      wrapper.update();

      const mockEvent = { nativeEvent: { locationX: 0, locationY: 0 } };
      wrapper.simulate('pressIn', mockEvent);

      const ripple = shallow(wrapper.find(View).get(1));
      const styles = StyleSheet.flatten(ripple.prop('style'));
      expect(styles).toMatchObject({
        height: '900px',
        width: '900px'
      });
    });
  });

  describe('onPressIn', () => {
    test('calls onPressIn prop', () => {
      const handlePressIn = jest.fn();
      const wrapper = shallow(
        <Ripple onPressIn={handlePressIn}>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 0, locationY: 0 } };
      wrapper.simulate('pressIn', mockEvent);
      expect(handlePressIn).toHaveBeenCalledWith(mockEvent);
    });

    test('renders the ripple', () => {
      const handlePressIn = jest.fn();
      const wrapper = shallow(
        <Ripple onPressIn={handlePressIn}>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 40, locationY: 20 } };
      wrapper.simulate('pressIn', mockEvent);
      const ripple = shallow(wrapper.find(View).get(1));
      const styles = StyleSheet.flatten(ripple.prop('style'));
      expect(styles).toMatchObject({
        backgroundColor: 'rgba(0,0,0,0.20)',
        left: '-10px',
        top: '-30px',
        width: '100px',
        height: '100px'
      });
    });

    test('does not run when disabled', () => {
      const handlePressIn = jest.fn();
      const wrapper = shallow(
        <Ripple disabled onPressIn={handlePressIn}>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 0, locationY: 0 } };
      wrapper.simulate('pressIn', mockEvent);
      expect(handlePressIn).not.toHaveBeenCalled();
      const ripple = shallow(wrapper.find(View).get(1));
      const styles = StyleSheet.flatten(ripple.prop('style'));
      expect(styles).toMatchObject({
        height: '0px'
      });
    });
  });

  describe('onPressOut', () => {
    test('calls onPressOut prop', () => {
      const handlePressOut = jest.fn();
      const wrapper = shallow(
        <Ripple onPressOut={handlePressOut}>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 0, locationY: 0 } };
      wrapper.simulate('pressOut', mockEvent);
      expect(handlePressOut).toHaveBeenCalledWith(mockEvent);
    });

    test('un-renders the ripple after 400ms', () => {
      const handlePressOut = jest.fn();
      const wrapper = shallow(
        <Ripple onPressOut={handlePressOut}>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 40, locationY: 20 } };
      wrapper.simulate('pressIn', mockEvent);
      wrapper.simulate('pressOut', mockEvent);
      jest.advanceTimersByTime(401);
      wrapper.update();

      const ripple = shallow(wrapper.find(View).get(1));
      const styles = StyleSheet.flatten(ripple.prop('style'));
      expect(styles).toMatchObject({
        backgroundColor: 'rgba(0,0,0,0.20)',
        left: '-10px',
        top: '-30px',
        width: '0px',
        height: '0px'
      });
    });

    test('does not try rendering the pressOut if unmounted', () => {
      const wrapper = shallow(
        <Ripple>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 40, locationY: 20 } };
      wrapper.simulate('pressIn', mockEvent);
      wrapper.simulate('pressOut', mockEvent);
      expect(() => {
        wrapper.unmount();
        jest.advanceTimersByTime(401);
      }).not.toThrow();
    });

    test('does not run when disabled', () => {
      const handlePressOut = jest.fn();
      const wrapper = shallow(
        <Ripple disabled onPressIn={handlePressOut}>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 0, locationY: 0 } };
      wrapper.simulate('pressIn', mockEvent);
      wrapper.simulate('pressOut', mockEvent);
      jest.advanceTimersByTime(401);
      wrapper.update();

      expect(handlePressOut).not.toHaveBeenCalled();
      const ripple = shallow(wrapper.find(View).get(1));
      const styles = StyleSheet.flatten(ripple.prop('style'));
      expect(styles).toMatchObject({
        height: '0px'
      });
    });
  });
});
