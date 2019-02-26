/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import Ripple from '../Ripple';
import { fireEvent, render } from 'react-native-testing-library';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

describe('Ripple', () => {
  describe('layout', () => {
    test('gets the width and height via onLayou', () => {
      const { getByType, queryAllByType } = render(
        <Ripple>
          <div />
        </Ripple>
      );

      const views = queryAllByType(View);

      const mockLayoutEvent = { nativeEvent: { layout: { width: 400, height: 300 } } };
      fireEvent(views[1], 'layout', mockLayoutEvent);

      const mockEvent = { nativeEvent: { locationX: 0, locationY: 0 } };
      fireEvent(getByType(TouchableOpacity), 'pressIn', mockEvent);

      const styles = StyleSheet.flatten(views[2].props.style);
      expect(styles).toMatchObject({
        height: 900,
        width: 900
      });
    });
  });

  describe('onPressIn', () => {
    test('calls onPressIn prop', () => {
      const handlePressIn = jest.fn();
      const { getByType } = render(
        <Ripple onPressIn={handlePressIn}>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 0, locationY: 0 } };
      fireEvent(getByType(TouchableOpacity), 'pressIn', mockEvent);
      expect(handlePressIn).toHaveBeenCalledWith(mockEvent);
    });

    test('renders the ripple', () => {
      const handlePressIn = jest.fn();
      const { getByType, queryAllByType } = render(
        <Ripple onPressIn={handlePressIn}>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 40, locationY: 20 } };
      fireEvent(getByType(TouchableOpacity), 'pressIn', mockEvent);
      const ripple = queryAllByType(View)[2];
      const styles = StyleSheet.flatten(ripple.props.style);
      expect(styles).toMatchObject({
        backgroundColor: 'rgba(0,0,0,0.2)',
        left: -10,
        top: -30,
        width: 100,
        height: 100
      });
    });

    test('does not run when disabled', () => {
      const handlePressIn = jest.fn();
      const { getByType, queryAllByType } = render(
        <Ripple disabled onPressIn={handlePressIn}>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 0, locationY: 0 } };
      fireEvent(getByType(TouchableOpacity), 'pressIn', mockEvent);
      expect(handlePressIn).not.toHaveBeenCalled();
      const ripple = queryAllByType(View)[2];
      const styles = StyleSheet.flatten(ripple.props.style);
      expect(styles).toMatchObject({
        height: 0
      });
    });
  });

  describe('onPressOut', () => {
    test('calls onPressOut prop', () => {
      const handlePressOut = jest.fn();
      const { getByType } = render(
        <Ripple onPressOut={handlePressOut}>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 0, locationY: 0 } };
      fireEvent(getByType(TouchableOpacity), 'pressOut', mockEvent);
      expect(handlePressOut).toHaveBeenCalledWith(mockEvent);
    });

    test('un-renders the ripple after 400ms', () => {
      const handlePressOut = jest.fn();
      const { getByType, queryAllByType } = render(
        <Ripple onPressOut={handlePressOut}>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 40, locationY: 20 } };
      fireEvent(getByType(TouchableOpacity), 'pressIn', mockEvent);
      fireEvent(getByType(TouchableOpacity), 'pressOut', mockEvent);
      jest.advanceTimersByTime(401);

      const ripple = queryAllByType(View)[2];
      const styles = StyleSheet.flatten(ripple.props.style);
      expect(styles).toMatchObject({
        backgroundColor: 'rgba(0,0,0,0.2)',
        left: -10,
        top: -30,
        width: 0,
        height: 0
      });
    });

    test('does not try rendering the pressOut if unmounted', () => {
      const { getByType, unmount } = render(
        <Ripple>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 40, locationY: 20 } };
      fireEvent(getByType(TouchableOpacity), 'pressIn', mockEvent);
      fireEvent(getByType(TouchableOpacity), 'pressOut', mockEvent);
      expect(() => {
        unmount();
        jest.advanceTimersByTime(401);
      }).not.toThrow();
    });

    test('does not run when disabled', () => {
      const handlePressOut = jest.fn();
      const { getByType, queryAllByType } = render(
        <Ripple disabled onPressIn={handlePressOut}>
          <div />
        </Ripple>
      );
      const mockEvent = { nativeEvent: { locationX: 0, locationY: 0 } };
      fireEvent(getByType(TouchableOpacity), 'pressIn', mockEvent);
      fireEvent(getByType(TouchableOpacity), 'pressOut', mockEvent);
      jest.advanceTimersByTime(401);

      expect(handlePressOut).not.toHaveBeenCalled();
      const ripple = queryAllByType(View)[2];
      const styles = StyleSheet.flatten(ripple.props.style);
      expect(styles).toMatchObject({
        height: 0
      });
    });
  });
});
