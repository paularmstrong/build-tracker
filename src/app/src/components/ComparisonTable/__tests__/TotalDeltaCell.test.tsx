/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { CellType } from '@build-tracker/comparator';
import React from 'react';
import { Td } from '../../Table';
import { TotalDeltaCell } from '../TotalDeltaCell';
import { fireEvent, render } from 'react-native-testing-library';
import { StyleSheet, Text } from 'react-native';

describe('TotalDeltaCell', () => {
  describe('text', () => {
    test('is a formatted value', () => {
      const { queryAllByText } = render(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { stat: 0.5 }, sizes: { stat: 4300 } }}
          sizeKey="stat"
        />
      );
      expect(queryAllByText('4.2 KiB')).toHaveLength(1);
    });

    test('is empty string if value is zero', () => {
      const { queryAllByType } = render(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { stat: 0 }, sizes: { stat: 0 } }}
          sizeKey="stat"
        />
      );
      expect(queryAllByType(Text)).toHaveLength(0);
    });

    test('shows formatted bytes and delta in the title', () => {
      const { getByType } = render(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { stat: -0.5 }, sizes: { stat: -134 } }}
          sizeKey="stat"
        />
      );

      expect(getByType(Td).props.accessibilityLabel).toEqual('-134 bytes (-50.000%)');
    });
  });

  describe('background color scale', () => {
    test('is green for reductions', () => {
      const { getByType } = render(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { gzip: -1 }, sizes: { gzip: -4300 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({
        backgroundColor: 'rgba(6,176,41,1)'
      });
    });

    test('is red for increases', () => {
      const { getByType } = render(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { gzip: 0.9 }, sizes: { gzip: 4300 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({
        backgroundColor: 'rgba(249,84,84,0.9)'
      });
    });

    test('is white if no size change', () => {
      const { getByType } = render(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { gzip: 0 }, sizes: { gzip: 0 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({
        backgroundColor: 'white'
      });
    });

    test('is white for no change', () => {
      const { getByType } = render(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { gzip: 0 }, sizes: { gzip: 0 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({ backgroundColor: 'white' });
    });
  });

  describe('tooltip', () => {
    test('mouse enter shows a tooltip', () => {
      const { getByTestId, queryAllByProps } = render(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { gzip: 1 }, sizes: { gzip: 1024 } }}
          sizeKey="gzip"
        />
      );
      fireEvent(getByTestId('delta'), 'mouseEnter');
      expect(queryAllByProps({ accessibilityRole: 'tooltip' })).toHaveLength(1);
    });

    test('mouse leave removes the tooltip', () => {
      const { getByTestId, queryAllByProps } = render(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { gzip: 1 }, sizes: { gzip: 1024 } }}
          sizeKey="gzip"
        />
      );
      fireEvent(getByTestId('delta'), 'mouseEnter');
      fireEvent(getByTestId('delta'), 'mouseLeave');
      expect(queryAllByProps({ accessibilityRole: 'tooltip' })).toHaveLength(0);
    });
  });
});
