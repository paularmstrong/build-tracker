/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ColorScale } from '../ColorScale';
import ColorScales from '../../../modules/ColorScale';
import RadioSelect from '../../RadioSelect';
import React from 'react';
import { fireEvent, render } from 'react-native-testing-library';

describe('ColorScale', () => {
  describe('rendering', () => {
    test('wraps the radio in a label', () => {
      const { queryAllByProps } = render(<ColorScale name="tacos" onSelect={jest.fn()} scale={ColorScales.Magma} />);
      expect(queryAllByProps({ accessibilityRole: 'label' })).toHaveLength(1);
    });
  });

  describe('isSelected', () => {
    test('sets checkbox value when true', () => {
      const { getByType } = render(
        <ColorScale isSelected name="tacos" onSelect={jest.fn()} scale={ColorScales.Magma} />
      );
      expect(getByType(RadioSelect).props.value).toBe(true);
    });

    test('does not set checkbox value when false', () => {
      const { getByType } = render(<ColorScale name="tacos" onSelect={jest.fn()} scale={ColorScales.Magma} />);
      expect(getByType(RadioSelect).props.value).toBeUndefined();
    });
  });

  describe('onSelect', () => {
    test('fires onSelect with the value', () => {
      const handleOnSelect = jest.fn();
      const { getByType } = render(<ColorScale onSelect={handleOnSelect} name="tacos" scale={ColorScales.Rainbow} />);
      fireEvent(getByType(RadioSelect), 'valueChange', true);
      expect(handleOnSelect).toHaveBeenCalledWith(ColorScales.Rainbow);
    });

    test('does not fire onSelect when value changes to false', () => {
      const handleOnSelect = jest.fn();
      const { getByType } = render(<ColorScale onSelect={handleOnSelect} name="tacos" scale={ColorScales.Rainbow} />);
      fireEvent(getByType(RadioSelect), 'valueChange', false);
      expect(handleOnSelect).not.toHaveBeenCalled();
    });
  });
});
