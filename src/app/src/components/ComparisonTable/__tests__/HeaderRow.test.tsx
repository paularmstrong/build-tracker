/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { HeaderRow } from '../HeaderRow';
import React from 'react';
import { render } from 'react-native-testing-library';
import { RevisionCell } from '../RevisionCell';
import { RevisionDeltaCell } from '../RevisionDeltaCell';
import { TextCell } from '../TextCell';
import { CellType, HeaderRow as HRow } from '@build-tracker/comparator';

describe('HeaderRow', () => {
  describe('render', () => {
    test('text cell', () => {
      const row: HRow = [{ type: CellType.TEXT, text: 'tacos' }];
      const { getByType } = render(<HeaderRow onFocusRevision={jest.fn()} onRemoveRevision={jest.fn()} row={row} />);
      expect(getByType(TextCell).props).toMatchObject({
        cell: row[0],
        header: true,
        style: expect.objectContaining({ backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 4 })
      });
    });

    test('revision cell', () => {
      const row: HRow = [{ type: CellType.TEXT, text: 'tacos' }, { type: CellType.REVISION, revision: 'asdf' }];
      const handleFocusRevision = jest.fn();
      const handleRemoveRevision = jest.fn();
      const { getByType } = render(
        <HeaderRow onFocusRevision={handleFocusRevision} onRemoveRevision={handleRemoveRevision} row={row} />
      );
      expect(getByType(RevisionCell).props).toMatchObject({
        cell: row[1],
        onFocus: handleFocusRevision,
        onRemove: handleRemoveRevision,
        style: expect.objectContaining({ backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 4 })
      });
    });

    test('revision delta cell', () => {
      const row: HRow = [
        { type: CellType.TEXT, text: 'tacos' },
        { type: CellType.REVISION_DELTA, revision: 'tacos', deltaIndex: 1, againstRevision: 'burritos' }
      ];
      const { getByType } = render(<HeaderRow onFocusRevision={jest.fn()} onRemoveRevision={jest.fn()} row={row} />);
      expect(getByType(RevisionDeltaCell).props).toMatchObject({
        cell: row[1],
        style: expect.objectContaining({ backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 4 })
      });
    });
  });
});
