/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { CellType } from '@build-tracker/comparator';
import React from 'react';
import { render } from 'react-native-testing-library';
import { Text } from 'react-native';
import { TotalCell } from '../TotalCell';

describe('TotalCell', () => {
  test('Displays a formatted value', () => {
    const { queryAllByText } = render(
      <TotalCell cell={{ type: CellType.TOTAL, name: 'tacos', sizes: { stat: 4300 } }} sizeKey="stat" />
    );
    expect(queryAllByText('4.2 KiB')).toHaveLength(1);
  });

  test('Displays empty string if value is zero', () => {
    const { queryAllByType } = render(
      <TotalCell cell={{ type: CellType.TOTAL, name: 'tacos', sizes: { stat: 0 } }} sizeKey="stat" />
    );
    expect(queryAllByType(Text)).toHaveLength(0);
  });
});
