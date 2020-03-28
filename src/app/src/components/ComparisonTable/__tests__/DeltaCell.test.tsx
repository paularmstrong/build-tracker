/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { CellType } from '@build-tracker/comparator';
import { DeltaCell } from '../DeltaCell';
import ErrorIcon from '../../../icons/Error';
import HashIcon from '../../../icons/Hash';
import React from 'react';
import { Td } from '../../Table';
import WarningIcon from '../../../icons/Warning';
import { BudgetLevel, BudgetType } from '@build-tracker/types';
import { fireEvent, render } from 'react-native-testing-library';
import { formatBudgetResult, formatUnexpectedHashChange } from '@build-tracker/formatting';
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
            hashChangeUnexpected: false,
            sizes: { stat: 4300 },
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
            hashChangeUnexpected: false,
            sizes: { stat: 0 },
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
            hashChangeUnexpected: false,
            sizes: { stat: -134 },
          }}
          sizeKey="stat"
        />
      );

      expect(getByType(Td).props.accessibilityLabel).toEqual('"tacos" changed by -134 bytes (-50.000%)');
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
            hashChangeUnexpected: true,
            sizes: { stat: 0 },
          }}
          sizeKey="stat"
        />
      );
      expect(queryAllByType(HashIcon)).toHaveLength(1);
      expect(getByType(Td).props.accessibilityLabel).toEqual('Hash: *tacos* hash changed without any file size change');
    });

    test('shows a warning icon if warning budget fails', () => {
      const budget = {
        level: BudgetLevel.WARN,
        type: BudgetType.SIZE,
        sizeKey: 'stat',
        passing: false,
        actual: 5,
        expected: 2,
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
            hashChangeUnexpected: false,
            sizes: { stat: 5 },
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
        expected: 2,
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
            hashChangeUnexpected: false,
            sizes: { stat: 5 },
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
            hashChangeUnexpected: false,
            sizes: { gzip: -4300 },
          }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({
        backgroundColor: 'rgba(6,176,41,1)',
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
            hashChangeUnexpected: false,
            sizes: { gzip: 4300 },
          }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({
        backgroundColor: 'rgba(249,84,84,0.9)',
      });
    });

    test('is warning color if hash changed unexpectedly', () => {
      const { getByType } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { gzip: 0 },
            hashChanged: true,
            hashChangeUnexpected: true,
            sizes: { gzip: 0 },
          }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({
        backgroundColor: 'rgba(237,170,46,0.5)',
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
            hashChangeUnexpected: false,
            sizes: { gzip: 0 },
          }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({ backgroundColor: 'transparent' });
    });
  });

  describe('tooltip', () => {
    beforeEach(() => {
      // Enable the hover monitor
      document.dispatchEvent(new Event('mousemove'));
    });

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
            hashChangeUnexpected: false,
            sizes: { gzip: 1024 },
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
            hashChangeUnexpected: false,
            sizes: { gzip: 1024 },
          }}
          sizeKey="gzip"
        />
      );
      fireEvent(getByTestId('delta'), 'mouseEnter');
      fireEvent(getByTestId('delta'), 'mouseLeave');
      expect(queryAllByProps({ accessibilityRole: 'tooltip' })).toHaveLength(0);
    });
  });

  describe('modal dialog', () => {
    test('shows and hides modal dialog when closed', () => {
      const { getByProps, getByText } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { gzip: 0.2, stat: 0.5 },
            hashChanged: true,
            hashChangeUnexpected: false,
            sizes: { gzip: 2400, stat: 4300 },
          }}
          sizeKey="stat"
        />
      );
      fireEvent.press(getByText('4.2 KiB'));
      expect(getByProps({ role: 'dialog' })).not.toBeNull();
      fireEvent.press(getByProps({ role: 'button', 'aria-label': 'Close' }));
      expect(() => getByProps({ role: 'dialog' })).toThrow();
    });

    test('renders all stat size information in a modal dialog', () => {
      const { getByText, queryAllByText } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { gzip: 0.2, stat: 0.5 },
            hashChanged: true,
            hashChangeUnexpected: false,
            sizes: { gzip: 2400, stat: 4300 },
          }}
          sizeKey="stat"
        />
      );
      fireEvent.press(getByText('4.2 KiB'));
      expect(queryAllByText('gzip')).toHaveLength(1);
      expect(queryAllByText('2.34 KiB (20.000%)')).toHaveLength(1);
      expect(queryAllByText('gzip')).toHaveLength(1);
      expect(queryAllByText('4.2 KiB (50.000%)')).toHaveLength(1);
    });

    test('renders a footer with a text summary of failing budgets', () => {
      const budget0 = {
        level: BudgetLevel.ERROR,
        type: BudgetType.SIZE,
        sizeKey: 'stat',
        passing: false,
        actual: 5,
        expected: 2,
      };
      const budget1 = {
        level: BudgetLevel.WARN,
        type: BudgetType.DELTA,
        sizeKey: 'stat',
        passing: false,
        actual: 5,
        expected: 2,
      };
      const budget2 = {
        level: BudgetLevel.WARN,
        type: BudgetType.PERCENT_DELTA,
        sizeKey: 'stat',
        passing: false,
        actual: 5,
        expected: 2,
      };
      const { getByText, queryAllByText } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [budget0, budget1, budget2],
            failingBudgets: [budget0, budget1],
            name: 'tacos',
            percents: { gzip: 0.2, stat: 0.5 },
            hashChanged: true,
            hashChangeUnexpected: false,
            sizes: { gzip: 2400, stat: 4300 },
          }}
          sizeKey="stat"
        />
      );
      fireEvent.press(getByText('4.2 KiB'));
      expect(queryAllByText(formatBudgetResult(budget0, 'tacos', true))).toHaveLength(1);
      expect(queryAllByText(formatBudgetResult(budget1, 'tacos', true))).toHaveLength(1);
      expect(queryAllByText(formatBudgetResult(budget2, 'tacos', true))).toHaveLength(0);
    });

    test('renders a footer with a text summary of unexpected hash change', () => {
      const { getByText, queryAllByText } = render(
        <DeltaCell
          cell={{
            type: CellType.DELTA,
            budgets: [],
            failingBudgets: [],
            name: 'tacos',
            percents: { gzip: 0.2, stat: 0.5 },
            hashChanged: true,
            hashChangeUnexpected: true,
            sizes: { gzip: 2400, stat: 4300 },
          }}
          sizeKey="stat"
        />
      );
      fireEvent.press(getByText('4.2 KiB'));
      expect(queryAllByText(formatUnexpectedHashChange('tacos', true))).toHaveLength(1);
    });
  });
});
