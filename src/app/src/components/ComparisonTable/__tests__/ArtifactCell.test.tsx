import { ArtifactCell } from '../ArtifactCell';
import { CellType } from '@build-tracker/comparator';
import React from 'react';
import { shallow } from 'enzyme';
import { Switch } from 'react-native';

describe('ArtifactCell', () => {
  describe('switch', () => {
    test('toggles with the name and on', () => {
      const handleDisable = jest.fn();
      const handleEnable = jest.fn();
      const wrapper = shallow(
        <ArtifactCell
          cell={{ type: CellType.ARTIFACT, text: 'tacos' }}
          color="red"
          isActive={false}
          onDisable={handleDisable}
          onEnable={handleEnable}
        />
      );
      wrapper.find(Switch).simulate('valueChange', true);
      expect(handleEnable).toHaveBeenCalledWith('tacos');
    });

    test('toggles with the name and off', () => {
      const handleDisable = jest.fn();
      const handleEnable = jest.fn();
      const wrapper = shallow(
        <ArtifactCell
          cell={{ type: CellType.ARTIFACT, text: 'tacos' }}
          color="red"
          isActive
          onDisable={handleDisable}
          onEnable={handleEnable}
        />
      );
      wrapper.find(Switch).simulate('valueChange', false);
      expect(handleDisable).toHaveBeenCalledWith('tacos');
    });
  });
});
