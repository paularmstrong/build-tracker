/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { CellType } from '@build-tracker/comparator';
import React from 'react';
import { RevisionCell } from '../RevisionCell';
import { fireEvent, render } from '@testing-library/react';

const wrapCell = (content): React.ReactElement => {
  return (
    <>
      <table>
        <tbody>
          <tr>{content}</tr>
        </tbody>
      </table>
      <div id="menuPortal" />
    </>
  );
};

describe('RevisionCell', () => {
  describe('menu', () => {
    test('shows a menu on press', () => {
      const { getByRole, queryAllByRole } = render(
        wrapCell(
          <RevisionCell
            cell={{ type: CellType.REVISION, revision: '1234567' }}
            onFocus={jest.fn()}
            onRemove={jest.fn()}
          />
        )
      );
      expect(queryAllByRole('menu')).toHaveLength(0);
      fireEvent.contextMenu(getByRole('button'));
      expect(queryAllByRole('menu')).toHaveLength(1);
    });

    test('dismisses the menu when item is pressed', () => {
      const { getByRole, queryAllByRole } = render(
        wrapCell(
          <RevisionCell
            cell={{ type: CellType.REVISION, revision: '1234567' }}
            onFocus={jest.fn()}
            onRemove={jest.fn()}
          />
        )
      );
      fireEvent.contextMenu(getByRole('button'));
      fireEvent.touchStart(queryAllByRole('menuitem')[0]);
      fireEvent.touchEnd(queryAllByRole('menuitem')[0]);
      expect(queryAllByRole('menu')).toHaveLength(0);
    });

    test('allows removing the revision', () => {
      const handleRemove = jest.fn();
      const { getByLabelText, getByRole } = render(
        wrapCell(
          <RevisionCell
            cell={{ type: CellType.REVISION, revision: '1234567' }}
            onFocus={jest.fn()}
            onRemove={handleRemove}
          />
        )
      );
      fireEvent.contextMenu(getByRole('button'));
      fireEvent.touchStart(getByLabelText('Remove'));
      fireEvent.touchEnd(getByLabelText('Remove'));
      expect(handleRemove).toHaveBeenCalledWith('1234567');
    });

    test('allows focusing the revision', () => {
      const handleFocus = jest.fn();
      const { getByLabelText, getByRole } = render(
        wrapCell(
          <RevisionCell
            cell={{ type: CellType.REVISION, revision: '1234567' }}
            onFocus={handleFocus}
            onRemove={jest.fn()}
          />
        )
      );
      fireEvent.contextMenu(getByRole('button'));
      fireEvent.touchStart(getByLabelText('More info'));
      fireEvent.touchEnd(getByLabelText('More info'));
      expect(handleFocus).toHaveBeenCalledWith('1234567');
    });
  });

  describe('pressing', () => {
    test('allows focusing the revision', () => {
      const handleFocus = jest.fn();
      const { getByRole } = render(
        wrapCell(
          <RevisionCell
            cell={{ type: CellType.REVISION, revision: '1234567' }}
            onFocus={handleFocus}
            onRemove={jest.fn()}
          />
        )
      );
      fireEvent.touchStart(getByRole('button'));
      fireEvent.touchEnd(getByRole('button'));
      expect(handleFocus).toHaveBeenCalledWith('1234567');
    });
  });

  describe('hovering', () => {
    beforeEach(() => {
      // increase date now aggressively to allow mousemove to enable hover events
      jest.spyOn(Date, 'now').mockReturnValue(100000000000000);
      document.dispatchEvent(new Event('mousemove'));
    });

    test('sets hover styles', () => {
      const { getByLabelText } = render(
        wrapCell(
          <RevisionCell
            cell={{ type: CellType.REVISION, revision: '1234567' }}
            onFocus={jest.fn()}
            onRemove={jest.fn()}
          />
        )
      );

      fireEvent.mouseEnter(getByLabelText('Build 1234567'));
      expect(getByLabelText('Build 1234567').style).toMatchObject({
        'background-color': 'rgb(199, 235, 255)'
      });

      fireEvent.mouseLeave(getByLabelText('Build 1234567'));
      expect(getByLabelText('Build 1234567').style).not.toMatchObject({
        'background-color': 'rgb(199, 235, 255)'
      });
    });
  });
});
