/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { CellType } from '@build-tracker/comparator';
import { GroupCell } from '../GroupCell';
import React from 'react';
import { Switch } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';

describe('GroupCell', () => {
  describe('folder', () => {
    test('mouse enter shows a tooltip', () => {
      const { getByTestId, queryAllByProps } = render(
        <GroupCell
          cell={{ type: CellType.GROUP, text: 'tacos', artifactNames: ['main'] }}
          isActive={false}
          onDisable={jest.fn()}
          onEnable={jest.fn()}
          onFocus={jest.fn()}
        />
      );
      fireEvent(getByTestId('groupicon'), 'mouseEnter');
      expect(queryAllByProps({ accessibilityRole: 'tooltip' })).toHaveLength(1);
    });

    test('mouse leave removes the tooltip', () => {
      const { getByTestId, queryAllByProps } = render(
        <GroupCell
          cell={{ type: CellType.GROUP, text: 'tacos', artifactNames: ['main'] }}
          isActive={false}
          onDisable={jest.fn()}
          onEnable={jest.fn()}
          onFocus={jest.fn()}
        />
      );
      fireEvent(getByTestId('groupicon'), 'mouseEnter');
      fireEvent(getByTestId('groupicon'), 'mouseLeave');
      expect(queryAllByProps({ accessibilityRole: 'tooltip' })).toHaveLength(0);
    });
  });

  describe('switch', () => {
    test('toggles with the name and on', () => {
      const handleDisable = jest.fn();
      const handleEnable = jest.fn();
      const { getByType } = render(
        <GroupCell
          cell={{ type: CellType.GROUP, text: 'tacos', artifactNames: ['main'] }}
          isActive={false}
          onDisable={handleDisable}
          onEnable={handleEnable}
          onFocus={jest.fn()}
        />
      );
      fireEvent(getByType(Switch), 'valueChange', true);
      expect(handleEnable).toHaveBeenCalledWith(['main']);
    });

    test('toggles with the name and off', () => {
      const handleDisable = jest.fn();
      const handleEnable = jest.fn();
      const { getByType } = render(
        <GroupCell
          cell={{ type: CellType.GROUP, text: 'tacos', artifactNames: ['main'] }}
          isActive
          onDisable={handleDisable}
          onEnable={handleEnable}
          onFocus={jest.fn()}
        />
      );
      fireEvent(getByType(Switch), 'valueChange', false);
      expect(handleDisable).toHaveBeenCalledWith(['main']);
    });
  });

  describe('focus', () => {
    test('focuses the artifact', () => {
      const handleFocus = jest.fn();
      const { getByProps } = render(
        <GroupCell
          cell={{ type: CellType.GROUP, text: 'tacos', artifactNames: ['main'] }}
          isActive
          onDisable={jest.fn()}
          onEnable={jest.fn()}
          onFocus={handleFocus}
        />
      );
      fireEvent(getByProps({ accessibilityRole: 'button' }), 'press');
      expect(handleFocus).toHaveBeenCalledWith(['main']);
    });
  });
});
