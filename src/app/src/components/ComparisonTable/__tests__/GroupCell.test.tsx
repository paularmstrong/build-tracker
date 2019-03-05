/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { CellType } from '@build-tracker/comparator';
import { GroupCell } from '../GroupCell';
import React from 'react';
import { Switch } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';

describe('GroupCell', () => {
  describe('switch', () => {
    test('toggles with the name and on', () => {
      const handleDisable = jest.fn();
      const handleEnable = jest.fn();
      const { getByType } = render(
        <GroupCell
          cell={{ type: CellType.GROUP, text: 'tacos', artifactNames: ['main'] }}
          color="red"
          isActive={false}
          onDisable={handleDisable}
          onEnable={handleEnable}
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
          color="red"
          isActive
          onDisable={handleDisable}
          onEnable={handleEnable}
        />
      );
      fireEvent(getByType(Switch), 'valueChange', false);
      expect(handleDisable).toHaveBeenCalledWith(['main']);
    });
  });
});
