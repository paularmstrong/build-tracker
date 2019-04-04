/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { DeltaCell } from '../DeltaCell';
import { GroupCell } from '../GroupCell';
import { GroupRow } from '../GroupRow';
import React from 'react';
import { TotalCell } from '../TotalCell';
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
          isActive
          onDisable={handleDisable}
          onEnable={handleEnable}
          onFocus={jest.fn()}
          onHover={jest.fn()}
          row={row}
          sizeKey="stat"
        />
      );
      expect(getByType(GroupCell).props).toMatchObject({
        cell: row[0],
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
          isActive
          onDisable={jest.fn()}
          onEnable={jest.fn()}
          onFocus={jest.fn()}
          onHover={jest.fn()}
          row={row}
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
        {
          type: CellType.TOTAL_DELTA,
          name: 'tacos',
          hashChanged: true,
          budgets: [],
          failingBudgets: [],
          sizes: { stat: 4 },
          percents: { stat: 4 }
        }
      ];
      const { getByType } = render(
        <GroupRow
          isActive
          onDisable={jest.fn()}
          onEnable={jest.fn()}
          onFocus={jest.fn()}
          onHover={jest.fn()}
          row={row}
          sizeKey="stat"
        />
      );
      expect(getByType(DeltaCell).props).toMatchObject({
        cell: row[1],
        sizeKey: 'stat'
      });
    });
  });

  describe('hovering', () => {
    test('calls back to onHoverArtifact when mouse enter', () => {
      const row: GRow = [{ type: CellType.GROUP, artifactNames: ['tacos', 'burritos'], text: 'tacos' }];
      const handleHoverArtifacts = jest.fn();
      const { getByType } = render(
        <GroupRow
          isActive
          onDisable={jest.fn()}
          onEnable={jest.fn()}
          onFocus={jest.fn()}
          onHover={handleHoverArtifacts}
          row={row}
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
          isActive={false}
          onDisable={jest.fn()}
          onEnable={jest.fn()}
          onFocus={jest.fn()}
          onHover={handleHoverArtifacts}
          row={row}
          sizeKey="stat"
        />
      );
      fireEvent(getByType(Tr), 'mouseEnter');
      expect(handleHoverArtifacts).toHaveBeenCalledWith([]);
    });
  });
});
