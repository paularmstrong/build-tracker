import { CellType } from '@build-tracker/comparator';
import { DeltaCell } from '../DeltaCell';
import React from 'react';
import { shallow } from 'enzyme';
import { Td } from '../Table';
import { StyleSheet, Text } from 'react-native';

describe('DeltaCell', () => {
  describe('text', () => {
    test('is a formatted value', () => {
      const wrapper = shallow(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { stat: 0.5 }, hashChanged: true, sizes: { stat: 4300 } }}
          sizeKey="stat"
        />
      );
      expect(
        wrapper
          .find(Text)
          .children()
          .text()
      ).toEqual('4.2 KiB');
    });

    test('is empty string if value is zero', () => {
      const wrapper = shallow(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { stat: 0 }, hashChanged: false, sizes: { stat: 0 } }}
          sizeKey="stat"
        />
      );
      expect(
        wrapper
          .find(Text)
          .children()
          .exists()
      ).toBe(false);
    });

    test('shows formatted bytes and delta in the title', () => {
      const wrapper = shallow(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { stat: -0.5 }, hashChanged: true, sizes: { stat: -134 } }}
          sizeKey="stat"
        />
      );

      expect(wrapper.find(Td).prop('title')).toEqual('-134 bytes (-50.000%)');
    });

    test('shows a warning label if no change, but hash changed', () => {
      const wrapper = shallow(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { stat: 0 }, hashChanged: true, sizes: { stat: 0 } }}
          sizeKey="stat"
        />
      );
      expect(
        wrapper
          .find(Text)
          .children()
          .text()
      ).toBe('⚠️');

      expect(wrapper.find(Td).prop('title')).toEqual('Unexpected hash change! 0 bytes (0.000%)');
    });
  });

  describe('background color scale', () => {
    test('is green for reductions', () => {
      const wrapper = shallow(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { gzip: -1 }, hashChanged: true, sizes: { gzip: -4300 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(wrapper.find(Td).prop('style'))).toMatchObject({
        backgroundColor: 'rgba(6,176,41,1)'
      });
    });

    test('is red for increases', () => {
      const wrapper = shallow(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { gzip: 0.9 }, hashChanged: true, sizes: { gzip: 4300 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(wrapper.find(Td).prop('style'))).toMatchObject({
        backgroundColor: 'rgba(249,84,84,0.9)'
      });
    });

    test('is red if no size change', () => {
      const wrapper = shallow(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { gzip: 0 }, hashChanged: true, sizes: { gzip: 0 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(wrapper.find(Td).prop('style'))).toMatchObject({
        backgroundColor: 'rgba(249,84,84,1)'
      });
    });

    test('is white for no change', () => {
      const wrapper = shallow(
        <DeltaCell
          cell={{ type: CellType.DELTA, percents: { gzip: 0 }, hashChanged: false, sizes: { gzip: 0 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(wrapper.find(Td).prop('style'))).toMatchObject({ backgroundColor: 'white' });
    });
  });
});
