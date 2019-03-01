/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { CellType } from '@build-tracker/comparator';
import React from 'react';
import { RevisionDeltaCell } from '../RevisionDeltaCell';
import { fireEvent, render } from 'react-native-testing-library';

describe('RevisionDeltaCell', () => {
  describe('tooltip', () => {
    test('mouse enter shows a tooltip', () => {
      const { getByTestId, queryAllByProps } = render(
        <RevisionDeltaCell
          cell={{ type: CellType.REVISION_DELTA, revision: '1234', deltaIndex: 1, againstRevision: 'abcdef' }}
        />
      );
      fireEvent(getByTestId('delta'), 'mouseEnter');
      expect(queryAllByProps({ accessibilityRole: 'tooltip' })).toHaveLength(1);
    });

    test('mouse leave removes the tooltip', () => {
      const { getByTestId, queryAllByProps } = render(
        <RevisionDeltaCell
          cell={{ type: CellType.REVISION_DELTA, revision: '1234', deltaIndex: 1, againstRevision: 'abcdef' }}
        />
      );
      fireEvent(getByTestId('delta'), 'mouseEnter');
      fireEvent(getByTestId('delta'), 'mouseLeave');
      expect(queryAllByProps({ accessibilityRole: 'tooltip' })).toHaveLength(0);
    });
  });
});
