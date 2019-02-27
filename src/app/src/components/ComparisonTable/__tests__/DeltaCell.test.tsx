/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { CellType } from '@build-tracker/comparator';
import { DeltaCell } from '../DeltaCell';
import React from 'react';
import { render } from 'react-native-testing-library';
import { Td } from '../../Table';
import { StyleSheet, Text } from 'react-native';

describe('DeltaCell', () => {
  describe('text', () => {
    test('is a formatted value', () => {
      const { queryAllByText } = render(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { stat: 0.5 }, hashChanged: true, sizes: { stat: 4300 } }}
          sizeKey="stat"
        />
      );
      expect(queryAllByText('4.2 KiB')).toHaveLength(1);
    });

    test('is empty string if value is zero', () => {
      const { queryAllByType } = render(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { stat: 0 }, hashChanged: false, sizes: { stat: 0 } }}
          sizeKey="stat"
        />
      );
      expect(queryAllByType(Text)).toHaveLength(0);
    });

    test('shows formatted bytes and delta in the title', () => {
      const { getByType } = render(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { stat: -0.5 }, hashChanged: true, sizes: { stat: -134 } }}
          sizeKey="stat"
        />
      );

      expect(getByType(Td).props.title).toEqual('-134 bytes (-50.000%)');
    });

    test('shows a warning label if no change, but hash changed', () => {
      const { getByType, queryAllByText } = render(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { stat: 0 }, hashChanged: true, sizes: { stat: 0 } }}
          sizeKey="stat"
        />
      );
      expect(queryAllByText('⚠️')).toHaveLength(1);
      expect(getByType(Td).props.title).toEqual('Unexpected hash change! 0 bytes (0.000%)');
    });
  });

  describe('background color scale', () => {
    test('is green for reductions', () => {
      const { getByType } = render(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { gzip: -1 }, hashChanged: true, sizes: { gzip: -4300 } }}
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
          cell={{ type: CellType.DELTA, percents: { gzip: 0.9 }, hashChanged: true, sizes: { gzip: 4300 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({
        backgroundColor: 'rgba(249,84,84,0.9)'
      });
    });

    test('is red if no size change', () => {
      const { getByType } = render(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { gzip: 0 }, hashChanged: true, sizes: { gzip: 0 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({
        backgroundColor: 'rgba(249,84,84,1)'
      });
    });

    test('is white for no change', () => {
      const { getByType } = render(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { gzip: 0 }, hashChanged: false, sizes: { gzip: 0 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(getByType(Td).props.style)).toMatchObject({ backgroundColor: 'white' });
    });
  });
});
