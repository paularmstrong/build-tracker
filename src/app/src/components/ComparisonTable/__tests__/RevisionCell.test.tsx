/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../../theme';
import { CellType } from '@build-tracker/comparator';
import React from 'react';
import { RevisionCell } from '../RevisionCell';
import { Th } from '../../Table';
import { fireEvent, render } from 'react-native-testing-library';
import { StyleSheet, View } from 'react-native';

jest.mock('../../Menu', () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (props: any): React.ReactElement => {
    const { children, onDismiss, ...other } = props;
    return (
      <View accessibilityRole="menu" onPress={onDismiss} {...other}>
        {children}
      </View>
    );
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */
});

describe('RevisionCell', () => {
  describe('menu', () => {
    test('shows a menu on press', () => {
      const { getByProps, queryAllByProps } = render(
        <RevisionCell
          cell={{ type: CellType.REVISION, revision: '1234567' }}
          onFocus={jest.fn()}
          onRemove={jest.fn()}
        />
      );
      expect(queryAllByProps({ accessibilityRole: 'menu' })).toHaveLength(0);
      fireEvent.press(getByProps({ accessibilityRole: 'button' }));
      expect(queryAllByProps({ accessibilityRole: 'menu' })).toHaveLength(1);
    });

    test('dismisses the menu', () => {
      const { getByProps, queryAllByProps } = render(
        <RevisionCell
          cell={{ type: CellType.REVISION, revision: '1234567' }}
          onFocus={jest.fn()}
          onRemove={jest.fn()}
        />
      );
      fireEvent.press(getByProps({ accessibilityRole: 'button' }));
      fireEvent.press(getByProps({ accessibilityRole: 'menu' }));
      expect(queryAllByProps({ accessibilityRole: 'menu' })).toHaveLength(0);
    });

    test('dismisses the menu when item is pressed', () => {
      const { getByProps, queryAllByProps } = render(
        <RevisionCell
          cell={{ type: CellType.REVISION, revision: '1234567' }}
          onFocus={jest.fn()}
          onRemove={jest.fn()}
        />
      );
      fireEvent.press(getByProps({ accessibilityRole: 'button' }));
      fireEvent.press(queryAllByProps({ accessibilityRole: 'menuitem' })[0]);
      expect(queryAllByProps({ accessibilityRole: 'menu' })).toHaveLength(0);
    });

    test('allows removing the revision', () => {
      const handleRemove = jest.fn();
      const { getByProps } = render(
        <RevisionCell
          cell={{ type: CellType.REVISION, revision: '1234567' }}
          onFocus={jest.fn()}
          onRemove={handleRemove}
        />
      );
      fireEvent.press(getByProps({ accessibilityRole: 'button' }));
      fireEvent.press(getByProps({ label: 'Remove' }));
      expect(handleRemove).toHaveBeenCalledWith('1234567');
    });

    test('allows focusing the revision', () => {
      const handleFocus = jest.fn();
      const { getByProps } = render(
        <RevisionCell
          cell={{ type: CellType.REVISION, revision: '1234567' }}
          onFocus={handleFocus}
          onRemove={jest.fn()}
        />
      );
      fireEvent.press(getByProps({ accessibilityRole: 'button' }));
      fireEvent.press(getByProps({ label: 'More info' }));
      expect(handleFocus).toHaveBeenCalledWith('1234567');
    });
  });

  describe('hovering', () => {
    beforeEach(() => {
      // reset to no hover available
      document.dispatchEvent(new Event('mousemove'));
    });

    test('sets hover styles', () => {
      const { getByType } = render(
        <RevisionCell
          cell={{ type: CellType.REVISION, revision: '1234567' }}
          onFocus={jest.fn()}
          onRemove={jest.fn()}
        />
      );
      fireEvent(getByType(Th), 'mouseEnter');
      expect(StyleSheet.flatten(getByType(Th).props.style)).toMatchObject({
        backgroundColor: Theme.Color.Primary00
      });

      fireEvent(getByType(Th), 'mouseLeave');
      expect(StyleSheet.flatten(getByType(Th).props.style)).not.toMatchObject({
        backgroundColor: Theme.Color.Primary00
      });
    });
  });
});
