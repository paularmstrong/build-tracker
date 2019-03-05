/**
 * Copyright (c) 2019 Paul Armstrong
 */
import ColorScale from '../../../modules/ColorScale';
import { GroupCell } from '../GroupCell';
import { GroupRow } from '../GroupRow';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TotalCell } from '../TotalCell';
import { TotalDeltaCell } from '../TotalDeltaCell';
import { Tr } from '../../Table';
import { CellType, GroupRow as GRow } from '@build-tracker/comparator';
import { fireEvent, render } from 'react-native-testing-library';

describe('GroupRow', () => {
  describe('render', () => {
    test('artifact cell', () => {
      const row: GRow = [{ type: CellType.GROUP, artifactNames: ['tacos', 'burritos'], text: 'tacos' }];
      const handleDisable = jest.fn();
      const handleEnable = jest.fn();
      const { getByType } = render(
        <GroupRow
          colorScale={ColorScale.Rainbow}
          isActive
          isHovered={false}
          onDisable={handleDisable}
          onEnable={handleEnable}
          onHover={jest.fn()}
          row={row}
          rowIndex={1}
          sizeKey="stat"
        />
      );
      expect(getByType(GroupCell).props).toMatchObject({
        cell: row[0],
        color: ColorScale.Rainbow(1),
        isActive: true,
        onDisable: handleDisable,
        onEnable: handleEnable
      });
    });

    test('total cell', () => {
      const row: GRow = [
        { type: CellType.GROUP, artifactNames: ['tacos', 'burritos'], text: 'tacos' },
        { type: CellType.TOTAL, name: 'tacos', sizes: { stat: 4 } }
      ];
      const { getByType } = render(
        <GroupRow
          colorScale={ColorScale.Rainbow}
          isActive
          isHovered={false}
          onDisable={jest.fn()}
          onEnable={jest.fn()}
          onHover={jest.fn()}
          row={row}
          rowIndex={1}
          sizeKey="stat"
        />
      );
      expect(getByType(TotalCell).props).toMatchObject({
        cell: row[1],
        sizeKey: 'stat'
      });
    });

    test('total delta cell', () => {
      const row: GRow = [
        { type: CellType.GROUP, artifactNames: ['tacos', 'burritos'], text: 'tacos' },
        { type: CellType.TOTAL_DELTA, sizes: { stat: 4 }, percents: { stat: 4 } }
      ];
      const { getByType } = render(
        <GroupRow
          colorScale={ColorScale.Rainbow}
          isActive
          isHovered={false}
          onDisable={jest.fn()}
          onEnable={jest.fn()}
          onHover={jest.fn()}
          row={row}
          rowIndex={1}
          sizeKey="stat"
        />
      );
      expect(getByType(TotalDeltaCell).props).toMatchObject({
        cell: row[1],
        sizeKey: 'stat'
      });
    });
  });

  describe('hovering', () => {
    test('is transparent background when row is not isHovered', () => {
      const row: GRow = [
        { type: CellType.GROUP, artifactNames: ['tacos', 'burritos'], text: 'tacos' },
        { type: CellType.TOTAL, name: 'tacos', sizes: { stat: 4 } }
      ];
      const { getByType } = render(
        <GroupRow
          colorScale={ColorScale.Rainbow}
          isActive
          isHovered={false}
          onDisable={jest.fn()}
          onEnable={jest.fn()}
          onHover={jest.fn()}
          row={row}
          rowIndex={1}
          sizeKey="stat"
        />
      );
      expect(StyleSheet.flatten(getByType(Tr).props.style)).toMatchObject({
        backgroundColor: expect.any(String)
      });
    });

    test('is visually highlighed when the row isHovered', () => {
      const row: GRow = [
        { type: CellType.GROUP, artifactNames: ['tacos', 'burritos'], text: 'tacos' },
        { type: CellType.TOTAL, name: 'tacos', sizes: { stat: 4 } }
      ];
      const { getByType } = render(
        <GroupRow
          colorScale={ColorScale.Rainbow}
          isActive
          isHovered
          onDisable={jest.fn()}
          onEnable={jest.fn()}
          onHover={jest.fn()}
          row={row}
          rowIndex={1}
          sizeKey="stat"
        />
      );
      expect(StyleSheet.flatten(getByType(Tr).props.style)).toMatchObject({
        backgroundColor: 'rgb(228, 218, 241)'
      });
    });

    test('calls back to onHoverArtifact when mouse enter', () => {
      const row: GRow = [{ type: CellType.GROUP, artifactNames: ['tacos', 'burritos'], text: 'tacos' }];
      const handleHoverArtifacts = jest.fn();
      const { getByType } = render(
        <GroupRow
          colorScale={ColorScale.Rainbow}
          isActive
          isHovered
          onDisable={jest.fn()}
          onEnable={jest.fn()}
          onHover={handleHoverArtifacts}
          row={row}
          rowIndex={1}
          sizeKey="stat"
        />
      );
      fireEvent(getByType(Tr), 'mouseEnter');
      expect(handleHoverArtifacts).toHaveBeenCalledWith(['tacos', 'burritos']);
    });

    test('calls onHoverArtifact with empty array if is not active', () => {
      const row: GRow = [{ type: CellType.GROUP, artifactNames: ['tacos', 'burritos'], text: 'tacos' }];
      const handleHoverArtifacts = jest.fn();
      const { getByType } = render(
        <GroupRow
          colorScale={ColorScale.Rainbow}
          isActive={false}
          isHovered={false}
          onDisable={jest.fn()}
          onEnable={jest.fn()}
          onHover={handleHoverArtifacts}
          row={row}
          rowIndex={1}
          sizeKey="stat"
        />
      );
      fireEvent(getByType(Tr), 'mouseEnter');
      expect(handleHoverArtifacts).toHaveBeenCalledWith([]);
    });
  });
});
