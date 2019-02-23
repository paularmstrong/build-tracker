import { CellType } from '@build-tracker/comparator';
import React from 'react';
import { shallow } from 'enzyme';
import { Td } from '../Table';
import TotalDeltaCell from '../TotalDeltaCell';
import { StyleSheet, Text } from 'react-native';

describe('TotalDeltaCell', () => {
  describe('text', () => {
    test('is a formatted value', () => {
      const wrapper = shallow(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { stat: 0.5 }, sizes: { stat: 4300 } }}
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
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { stat: 0 }, sizes: { stat: 0 } }}
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
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { stat: -0.5 }, sizes: { stat: -134 } }}
          sizeKey="stat"
        />
      );

      expect(wrapper.find(Td).prop('title')).toEqual('-134 bytes (-50.000%)');
    });
  });

  describe('background color scale', () => {
    test('is green for reductions', () => {
      const wrapper = shallow(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { gzip: -1 }, sizes: { gzip: -4300 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(wrapper.find(Td).prop('style'))).toMatchObject({
        backgroundColor: 'rgba(6,176,41,1)'
      });
    });

    test('is red for increases', () => {
      const wrapper = shallow(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { gzip: 0.9 }, sizes: { gzip: 4300 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(wrapper.find(Td).prop('style'))).toMatchObject({
        backgroundColor: 'rgba(249,84,84,0.9)'
      });
    });

    test('is white if no size change', () => {
      const wrapper = shallow(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { gzip: 0 }, sizes: { gzip: 0 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(wrapper.find(Td).prop('style'))).toMatchObject({
        backgroundColor: 'white'
      });
    });

    test('is white for no change', () => {
      const wrapper = shallow(
        <TotalDeltaCell
          cell={{ type: CellType.TOTAL_DELTA, percents: { gzip: 0 }, sizes: { gzip: 0 } }}
          sizeKey="gzip"
        />
      );
      expect(StyleSheet.flatten(wrapper.find(Td).prop('style'))).toMatchObject({ backgroundColor: 'white' });
    });
  });
});
