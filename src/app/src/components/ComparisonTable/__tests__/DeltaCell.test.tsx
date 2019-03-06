/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { CellType } from '@build-tracker/comparator';
import { DeltaCell } from '../DeltaCell';
import ErrorIcon from '../../../icons/Error';
import React from 'react';
import { Td } from '../../Table';
import WarningIcon from '../../../icons/Warning';
import { BudgetLevel, BudgetType } from '@build-tracker/types';
import { fireEvent, render } from 'react-native-testing-library';
import { StyleSheet, Text } from 'react-native';

describe('DeltaCell', () => {
  describe('text', () => {
    test('is a formatted value', () => {
      const { queryAllByText } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { stat: 0.5 },
            hashChanged: true,
            sizes: { stat: 4300 }
          }}
          sizeKey="stat"
        />
      );
      expect(queryAllByText('4.2 KiB')).toHaveLength(1);
    });

    test('is empty string if value is zero', () => {
      const { queryAllByType } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { stat: 0 },
            hashChanged: false,
            sizes: { stat: 0 }
          }}
          sizeKey="stat"
        />
      );
      expect(queryAllByType(Text)).toHaveLength(0);
    });

    test('shows formatted bytes and delta in the title', () => {
      const { getByType } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { stat: -0.5 },
            hashChanged: true,
            sizes: { stat: -134 }
          }}
          sizeKey="stat"
        />
      );

      expect(getByType(Td).props.accessibilityLabel).toEqual('-134 bytes (-50.000%)');
    });

    test('shows a warning label if no change, but hash changed', () => {
      const { getByType, queryAllByType } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { stat: 0 },
            hashChanged: true,
            sizes: { stat: 0 }
          }}
          sizeKey="stat"
        />
      );
      expect(queryAllByType(WarningIcon)).toHaveLength(1);
      expect(getByType(Td).props.accessibilityLabel).toEqual('Unexpected hash change! 0 bytes (0.000%)');
    });

    test('shows a warning icon if warning budget fails', () => {
      const budget = {
        level: BudgetLevel.WARN,
        type: BudgetType.SIZE,
        sizeKey: 'stat',
        passing: false,
        actual: 5,
        expected: 2
      };
      const { queryAllByType } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [budget],
            failingBudgets: [budget],
            name: 'tacos',
            percents: { stat: 0 },
            hashChanged: false,
            sizes: { stat: 5 }
          }}
          sizeKey="stat"
        />
      );
      expect(queryAllByType(WarningIcon)).toHaveLength(1);
    });

    test('shows an error icon if error budget fails', () => {
      const budget = {
        level: BudgetLevel.ERROR,
        type: BudgetType.SIZE,
        sizeKey: 'stat',
        passing: false,
        actual: 5,
        expected: 2
      };
      const { queryAllByType } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [budget],
            failingBudgets: [budget],
            name: 'tacos',
            percents: { stat: 0 },
            hashChanged: false,
            sizes: { stat: 5 }
          }}
          sizeKey="stat"
        />
      );
      expect(queryAllByType(ErrorIcon)).toHaveLength(1);
    });
  });

  describe('background color scale', () => {
    test('is green for reductions', () => {
      const { getByType } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { gzip: -1 },
            hashChanged: true,
            sizes: { gzip: -4300 }
          }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({
        backgroundColor: 'rgba(6,176,41,1)'
      });
    });

    test('is red for increases', () => {
      const { getByType } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { gzip: 0.9 },
            hashChanged: true,
            sizes: { gzip: 4300 }
          }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({
        backgroundColor: 'rgba(249,84,84,0.9)'
      });
    });

    test('is warning color if no size change, but hash changed', () => {
      const { getByType } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { gzip: 0 },
            hashChanged: true,
            sizes: { gzip: 0 }
          }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({
        backgroundColor: 'rgba(237,170,46,0.5)'
      });
    });

    test('is transparent for no change', () => {
      const { getByType } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { gzip: 0 },
            hashChanged: false,
            sizes: { gzip: 0 }
          }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({ backgroundColor: 'transparent' });
    });
  });

  describe('tooltip', () => {
    test('mouse enter shows a tooltip', () => {
      const { getByTestId, queryAllByProps } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { gzip: 1 },
            hashChanged: false,
            sizes: { gzip: 1024 }
          }}
          sizeKey="gzip"
        />
      );
      fireEvent(getByTestId('delta'), 'mouseEnter');
      expect(queryAllByProps({ accessibilityRole: 'tooltip' })).toHaveLength(1);
    });

    test('mouse leave removes the tooltip', () => {
      const { getByTestId, queryAllByProps } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { gzip: 1 },
            hashChanged: false,
            sizes: { gzip: 1024 }
          }}
          sizeKey="gzip"
        />
      );
      fireEvent(getByTestId('delta'), 'mouseEnter');
      fireEvent(getByTestId('delta'), 'mouseLeave');
      expect(queryAllByProps({ accessibilityRole: 'tooltip' })).toHaveLength(0);
    });
  });
});
