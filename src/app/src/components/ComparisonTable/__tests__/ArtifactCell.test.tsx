/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ArtifactCell } from '../ArtifactCell';
import { CellType } from '@build-tracker/comparator';
import React from 'react';
import { Switch } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';

describe('ArtifactCell', () => {
  describe('switch', () => {
    test('toggles with the name and on', () => {
      const handleDisable = jest.fn();
      const handleEnable = jest.fn();
      const { getByType } = render(
        <ArtifactCell
          cell={{ type: CellType.ARTIFACT, text: 'tacos' }}
          color="red"
          isActive={false}
          onDisable={handleDisable}
          onEnable={handleEnable}
        />
      );
      fireEvent(getByType(Switch), 'valueChange', true);
      expect(handleEnable).toHaveBeenCalledWith('tacos');
    });

    test('toggles with the name and off', () => {
      const handleDisable = jest.fn();
      const handleEnable = jest.fn();
      const { getByType } = render(
        <ArtifactCell
          cell={{ type: CellType.ARTIFACT, text: 'tacos' }}
          color="red"
          isActive
          onDisable={handleDisable}
          onEnable={handleEnable}
        />
      );
      fireEvent(getByType(Switch), 'valueChange', false);
      expect(handleDisable).toHaveBeenCalledWith('tacos');
    });
  });
});
