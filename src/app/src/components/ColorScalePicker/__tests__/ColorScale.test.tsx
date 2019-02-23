import { ColorScale } from '../ColorScale';
import { mount } from 'enzyme';
import React from 'react';
import Ripple from '../../Ripple';
import ColorScaleContext, { scales } from '../../../context/ColorScale';
import { StyleSheet, View } from 'react-native';

jest.mock('../../Ripple', () => {
  return ({ children }) => children;
});

describe('ColorScale', () => {
  describe('onSelect', () => {
    test('passes the scale to the callback', () => {
      const handleSelect = jest.fn();
      const wrapper = mount(<ColorScale boxes={10} name="tacos" onSelect={handleSelect} scale={scales.Magma} />);
      wrapper.find(Ripple).prop('onPress')();
      expect(handleSelect).toHaveBeenCalledWith(scales.Magma);
    });
  });

  describe('selected', () => {
    test('is true when context scale matches', () => {
      const wrapper = mount(
        <ColorScaleContext.Provider value={scales.Rainbow}>
          <ColorScale boxes={10} name="tacos" onSelect={jest.fn()} scale={scales.Rainbow} />
        </ColorScaleContext.Provider>
      );

      expect(wrapper.find(Ripple).prop('aria-selected')).toBe(true);
    });

    test('is false when not the same as context scale', () => {
      const wrapper = mount(
        <ColorScaleContext.Provider value={scales.Magma}>
          <ColorScale boxes={10} name="tacos" onSelect={jest.fn()} scale={scales.Rainbow} />
        </ColorScaleContext.Provider>
      );

      expect(wrapper.find(Ripple).prop('aria-selected')).toBe(false);
    });
  });

  describe('hovering', () => {
    beforeEach(() => {
      document.dispatchEvent(new Event('mousemove'));
    });

    test('increases the visibility of the scale', () => {
      const wrapper = mount(<ColorScale boxes={10} name="tacos" onSelect={jest.fn()} scale={scales.Rainbow} />);

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
