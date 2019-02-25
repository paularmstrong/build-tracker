import React from 'react';
import SizeKeyButton from '../SizeKeyButton';
import { fireEvent, render } from 'react-native-testing-library';

describe('SizeKeyButton', () => {
  describe('isSelected', () => {
    test('sets aria-selected when tru', () => {
      const { getByProps } = render(<SizeKeyButton isSelected onSelect={jest.fn()} value="tacos" />);
      expect(getByProps({ title: 'tacos' }).props['aria-selected']).toBe(true);
    });

    test('disables the button when true', () => {
      const { getByProps } = render(<SizeKeyButton isSelected onSelect={jest.fn()} value="tacos" />);
      expect(getByProps({ title: 'tacos' }).props.disabled).toBe(true);
    });

    test('does not set aria-selected when false', () => {
      const { getByProps } = render(<SizeKeyButton onSelect={jest.fn()} value="tacos" />);
      expect(getByProps({ title: 'tacos' }).props['aria-selected']).toBeUndefined();
    });

    test('is not disabled when false', () => {
      const { getByProps } = render(<SizeKeyButton onSelect={jest.fn()} value="tacos" />);
      expect(getByProps({ title: 'tacos' }).props.disabled).toBe(false);
    });
  });

  describe('onSelect', () => {
    test('fires onSelect with the value', () => {
      const handleOnSelect = jest.fn();
      const { getByProps } = render(<SizeKeyButton onSelect={handleOnSelect} value="tacos" />);
      fireEvent.press(getByProps({ title: 'tacos' }));
      expect(handleOnSelect).toHaveBeenCalledWith('tacos');
    });
  });
});
