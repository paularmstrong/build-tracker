/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Button from '../Button';
import React from 'react';
import Ripple from '../Ripple';
import { fireEvent, render } from 'react-native-testing-library';
import { StyleSheet, TouchableOpacity } from 'react-native';

describe('Button', () => {
  describe('icon', () => {
    test('renders an icon before the title', () => {
      const FakeIcon = (): React.ReactElement => <div />;
      const { getByType } = render(<Button icon={FakeIcon} title="tacos" />);
      expect(getByType(FakeIcon)).not.toBeUndefined();
    });

    test('does not render the title when iconOnly', () => {
      const FakeIcon = (): React.ReactElement => <div />;
      const { getByText } = render(<Button icon={FakeIcon} iconOnly title="tacos" />);
      expect(() => getByText('tacos')).toThrow();
    });
  });

  describe('onPress', () => {
    test('property is called when button is pressed', () => {
      const handlePress = jest.fn();
      const { getByType } = render(<Button onPress={handlePress} title="tacos" />);
      fireEvent.press(getByType(TouchableOpacity));
      expect(handlePress).toHaveBeenCalled();
    });

    test('property is not called when disabled', () => {
      const handlePress = jest.fn();
      const { getByType } = render(<Button disabled onPress={handlePress} title="tacos" />);
      fireEvent.press(getByType(TouchableOpacity));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  describe('styles', () => {
    describe('active', () => {
      test('sets active styles while press inside', () => {
        const { getByType } = render(<Button title="tacos" type="raised" />);
        fireEvent(getByType(TouchableOpacity), 'pressIn', { nativeEvent: { locationX: 0, locationY: 0 } });
        expect(StyleSheet.flatten(getByType(Ripple).props.style)).toMatchObject({
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 3
        });
      });

      test('removes active styles after press out', () => {
        const { getByType } = render(<Button title="tacos" type="raised" />);
        fireEvent(getByType(TouchableOpacity), 'pressIn', { nativeEvent: { locationX: 0, locationY: 0 } });
        fireEvent(getByType(TouchableOpacity), 'pressOut', { nativeEvent: { locationX: 0, locationY: 0 } });
        expect(StyleSheet.flatten(getByType(Ripple).props.style)).toMatchObject({
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 5
        });
      });

      test('when disabled, does not set active styles', () => {
        const { getByType } = render(<Button disabled title="tacos" type="raised" />);
        fireEvent(getByType(TouchableOpacity), 'pressIn', { nativeEvent: { locationX: 0, locationY: 0 } });
        expect(StyleSheet.flatten(getByType(Ripple).props.style)).toMatchObject({
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 5
        });
        fireEvent(getByType(TouchableOpacity), 'pressOut', { nativeEvent: { locationX: 0, locationY: 0 } });
        expect(StyleSheet.flatten(getByType(Ripple).props.style)).toMatchObject({
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 5
        });
      });
    });
  });
});
