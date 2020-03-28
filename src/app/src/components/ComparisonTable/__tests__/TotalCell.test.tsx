/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { CellType } from '@build-tracker/comparator';
import React from 'react';
import { Text } from 'react-native';
import { TotalCell } from '../TotalCell';
import { fireEvent, render } from 'react-native-testing-library';

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

  describe('modal dialog', () => {
    test('shows and hides modal dialog when closed', () => {
      const { getByProps, getByText } = render(
        <TotalCell cell={{ type: CellType.TOTAL, name: 'tacos', sizes: { stat: 4300, gzip: 2400 } }} sizeKey="stat" />
      );
      fireEvent.press(getByText('4.2 KiB'));
      expect(getByProps({ role: 'dialog' })).not.toBeNull();
      fireEvent.press(getByProps({ role: 'button', 'aria-label': 'Close' }));
      expect(() => getByProps({ role: 'dialog' })).toThrow();
    });

    test('renders all stat size information in a modal dialog', () => {
      const { getByText, queryAllByText } = render(
        <TotalCell cell={{ type: CellType.TOTAL, name: 'tacos', sizes: { stat: 4300, gzip: 2400 } }} sizeKey="stat" />
      );
      fireEvent.press(getByText('4.2 KiB'));
      expect(queryAllByText('gzip')).toHaveLength(1);
      expect(queryAllByText('2.34 KiB')).toHaveLength(1);
      expect(queryAllByText('stat')).toHaveLength(1);
      expect(queryAllByText('4.2 KiB')).toHaveLength(2);
    });
  });
});
