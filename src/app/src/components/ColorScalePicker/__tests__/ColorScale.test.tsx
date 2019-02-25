import { ColorScale } from '../ColorScale';
import ColorScales from '../../../modules/ColorScale';
import { mount } from 'enzyme';
import React from 'react';
import Ripple from '../../Ripple';
import { StyleSheet, View } from 'react-native';

jest.mock('../../Ripple', () => {
  return ({ children }) => children;
});

describe('ColorScale', () => {
  describe('onSelect', () => {
    test('passes the scale to the callback', () => {
      const handleSelect = jest.fn();
      const wrapper = mount(
        <ColorScale boxes={10} isSelected={false} name="tacos" onSelect={handleSelect} scale={ColorScales.Magma} />
      );
      wrapper.find(Ripple).prop('onPress')();
      expect(handleSelect).toHaveBeenCalledWith(ColorScales.Magma);
    });
  });

  describe('isSelected', () => {
    test('sets aria-selected', () => {
      const wrapper = mount(
        <ColorScale boxes={10} isSelected name="tacos" onSelect={jest.fn()} scale={ColorScales.Rainbow} />
      );

      expect(wrapper.find(Ripple).prop('aria-selected')).toBe(true);
    });

    test('unsets aria-selected', () => {
      const wrapper = mount(
        <ColorScale boxes={10} isSelected={false} name="tacos" onSelect={jest.fn()} scale={ColorScales.Rainbow} />
      );

      expect(wrapper.find(Ripple).prop('aria-selected')).toBe(false);
    });
  });

  describe('hovering', () => {
    beforeEach(() => {
      document.dispatchEvent(new Event('mousemove'));
    });

    test('increases the visibility of the scale', () => {
      const wrapper = mount(
        <ColorScale boxes={10} name="tacos" isSelected onSelect={jest.fn()} scale={ColorScales.Rainbow} />
      );

      expect(
        StyleSheet.flatten(
          wrapper
            .find(View)
            .first()
            .prop('style')
        )
      ).toMatchObject({ opacity: 0.6 });

      wrapper.simulate('mouseEnter');
      expect(
        StyleSheet.flatten(
          wrapper
            .find(View)
            .first()
            .prop('style')
        )
      ).not.toMatchObject({ opacity: 1 });
    });
  });
});
