import ArtifactCell from '../ArtifactCell';
import { CellType } from '@build-tracker/comparator';
import React from 'react';
import { shallow } from 'enzyme';
import { Switch } from 'react-native';

describe('ArtifactCell', () => {
  describe('switch', () => {
    test('toggles with the name and on', () => {
      const handleToggle = jest.fn();
      const wrapper = shallow(
        <ArtifactCell
          cell={{ type: CellType.ARTIFACT, text: 'tacos' }}
          color="red"
          isActive={false}
          onToggle={handleToggle}
        />
      );
      wrapper.find(Switch).simulate('valueChange', true);
      expect(handleToggle).toHaveBeenCalledWith('tacos', true);
    });

    test('toggles with the name and off', () => {
      const handleToggle = jest.fn();
      const wrapper = shallow(
        <ArtifactCell cell={{ type: CellType.ARTIFACT, text: 'tacos' }} color="red" isActive onToggle={handleToggle} />
      );
      wrapper.find(Switch).simulate('valueChange', true);
      expect(handleToggle).toHaveBeenCalledWith('tacos', true);
    });
  });
});
