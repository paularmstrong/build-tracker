import { CellType } from '@build-tracker/comparator';
import React from 'react';
import { shallow } from 'enzyme';
import { Text } from 'react-native';
import TotalCell from '../TotalCell';

describe('TotalCell', () => {
  test('Displays a formatted value', () => {
    const wrapper = shallow(<TotalCell cell={{ type: CellType.TOTAL, sizes: { stat: 4300 } }} sizeKey="stat" />);
    expect(
      wrapper
        .find(Text)
        .children()
        .text()
    ).toEqual('4.2 KiB');
  });

  test('Displays empty string if value is zero', () => {
    const wrapper = shallow(<TotalCell cell={{ type: CellType.TOTAL, sizes: { stat: 0 } }} sizeKey="stat" />);
    expect(
      wrapper
        .find(Text)
        .children()
        .exists()
    ).toBe(false);
  });
});
