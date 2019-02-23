import { CellType } from '@build-tracker/comparator';
import React from 'react';
import { shallow } from 'enzyme';
import TextCell from '../TextCell';
import { Td, Th } from '../Table';

describe('TextCell', () => {
  describe('header', () => {
    test('renders as Th when true', () => {
      const wrapper = shallow(<TextCell cell={{ type: CellType.TEXT, text: 'tacos' }} header />);
      expect(wrapper.find(Th).exists()).toBe(true);
      expect(wrapper.find(Td).exists()).toBe(false);
    });

    test('renders as Td when false', () => {
      const wrapper = shallow(<TextCell cell={{ type: CellType.TEXT, text: 'tacos' }} />);
      expect(wrapper.find(Th).exists()).toBe(false);
      expect(wrapper.find(Td).exists()).toBe(true);
    });
  });
});
