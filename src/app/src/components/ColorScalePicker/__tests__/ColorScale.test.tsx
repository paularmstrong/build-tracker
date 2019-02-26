/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ColorScale } from '../ColorScale';
import ColorScales from '../../../modules/ColorScale';
import React from 'react';
import Ripple from '../../Ripple';
import { fireEvent, render } from 'react-native-testing-library';
import { StyleSheet, View } from 'react-native';

jest.mock('../../Ripple', () => {
  return ({ children }) => children;
});

describe('ColorScale', () => {
  describe('onSelect', () => {
    test('passes the scale to the callback', () => {
      const handleSelect = jest.fn();
      const { getByType } = render(
        <ColorScale boxes={10} isSelected={false} name="tacos" onSelect={handleSelect} scale={ColorScales.Magma} />
      );
      fireEvent.press(getByType(Ripple));
      expect(handleSelect).toHaveBeenCalledWith(ColorScales.Magma);
    });
  });

  describe('isSelected', () => {
    test('sets aria-selected', () => {
      const { getByType } = render(
        <ColorScale boxes={10} isSelected name="tacos" onSelect={jest.fn()} scale={ColorScales.Rainbow} />
      );

      expect(getByType(Ripple).props['aria-selected']).toBe(true);
    });

    test('unsets aria-selected', () => {
      const { getByType } = render(
        <ColorScale boxes={10} isSelected={false} name="tacos" onSelect={jest.fn()} scale={ColorScales.Rainbow} />
      );

      expect(getByType(Ripple).props['aria-selected']).toBe(false);
    });
  });

  describe('hovering', () => {
    beforeEach(() => {
      document.dispatchEvent(new Event('mousemove'));
    });

    test('increases the visibility of the scale', () => {
      const { getByType, queryAllByType } = render(
        <ColorScale boxes={10} name="tacos" isSelected onSelect={jest.fn()} scale={ColorScales.Rainbow} />
      );

      expect(StyleSheet.flatten(queryAllByType(View)[0].props.style)).toMatchObject({ opacity: 0.6 });
      fireEvent(getByType(Ripple), 'mouseEnter');
      expect(StyleSheet.flatten(queryAllByType(View)[0].props.style)).toMatchObject({ opacity: 1 });
    });
  });
});
