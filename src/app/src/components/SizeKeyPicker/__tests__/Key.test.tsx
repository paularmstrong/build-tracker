/**
 * Copyright (c) 2019 Paul Armstrong
 */
import RadioSelect from '../../RadioSelect';
import React from 'react';
import SizeKey from '../Key';
import { fireEvent, render } from 'react-native-testing-library';

describe('SizeKey', () => {
  describe('rendering', () => {
    test('wraps the radio in a label', () => {
      const { queryAllByProps } = render(<SizeKey isSelected onSelect={jest.fn()} value="tacos" />);
      expect(
        queryAllByProps({
          accessibilityRole: 'label'
        })
      ).toHaveLength(1);
    });
  });

  describe('isSelected', () => {
    test('sets checkbox value when true', () => {
      const { getByType } = render(<SizeKey isSelected onSelect={jest.fn()} value="tacos" />);
      expect(getByType(RadioSelect).props.value).toBe(true);
    });

    test('does not set checkbox value when false', () => {
      const { getByType } = render(<SizeKey onSelect={jest.fn()} value="tacos" />);
      expect(getByType(RadioSelect).props.value).toBeUndefined();
    });
  });

  describe('onSelect', () => {
    test('fires onSelect with the value', () => {
      const handleOnSelect = jest.fn();
      const { getByType } = render(<SizeKey onSelect={handleOnSelect} value="tacos" />);
      fireEvent(getByType(RadioSelect), 'valueChange', true);
      expect(handleOnSelect).toHaveBeenCalledWith('tacos');
    });

    test('does not fire onSelect when value changes to false', () => {
      const handleOnSelect = jest.fn();
      const { getByType } = render(<SizeKey onSelect={handleOnSelect} value="tacos" />);
      fireEvent(getByType(RadioSelect), 'valueChange', false);
      expect(handleOnSelect).not.toHaveBeenCalled();
    });
  });
});
