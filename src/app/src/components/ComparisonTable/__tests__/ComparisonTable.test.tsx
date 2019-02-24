import Build from '@build-tracker/build';
import buildDataA from '@build-tracker/fixtures/builds/30af629d1d4c9f2f199cec5f572a019d4198004c.json';
import buildDataB from '@build-tracker/fixtures/builds/22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04.json';
import buildDataC from '@build-tracker/fixtures/builds/243024909db66ac3c3e48d2ffe4015f049609834.json';
import ComparisonTable from '../ComparisonTable';
import React from 'react';
import { shallow } from 'enzyme';
import Comparator, { CellType } from '@build-tracker/comparator';

const builds = [
  new Build(buildDataA.meta, buildDataA.artifacts),
  new Build(buildDataB.meta, buildDataB.artifacts),
  new Build(buildDataC.meta, buildDataC.artifacts)
];

describe('ComparisonTable', () => {
  describe('artifact toggling', () => {
    test('artifact off', () => {
      const handleSetArtifacts = jest.fn();
      const comparator = new Comparator({ builds });
      const wrapper = shallow(
        <ComparisonTable
          activeArtifactNames={['vendor', 'main']}
          comparator={comparator}
          onSetActiveArtifacts={handleSetArtifacts}
          sizeKey="stat"
        />
      );
      wrapper.find({ cell: { type: CellType.ARTIFACT, text: 'vendor' } }).simulate('toggle', 'vendor', false);
      expect(handleSetArtifacts).toHaveBeenCalledWith(['main']);
    });

    test('artifact on', () => {
      const handleSetArtifacts = jest.fn();
      const comparator = new Comparator({ builds });
      const wrapper = shallow(
        <ComparisonTable
          activeArtifactNames={['main']}
          comparator={comparator}
          onSetActiveArtifacts={handleSetArtifacts}
          sizeKey="stat"
        />
      );
      wrapper.find({ cell: { type: CellType.ARTIFACT, text: 'vendor' } }).simulate('toggle', 'vendor', true);
      expect(handleSetArtifacts).toHaveBeenCalledWith(expect.arrayContaining(['main', 'vendor']));
    });

    test('all on', () => {
      const handleSetArtifacts = jest.fn();
      const comparator = new Comparator({ builds });
      const wrapper = shallow(
        <ComparisonTable
          activeArtifactNames={['vendor', 'main']}
          comparator={comparator}
          onSetActiveArtifacts={handleSetArtifacts}
          sizeKey="stat"
        />
      );
      wrapper.find({ cell: { type: CellType.ARTIFACT, text: 'All' } }).simulate('toggle', 'All', true);
      expect(handleSetArtifacts).toHaveBeenCalledWith(comparator.artifactNames);
    });
  });
});
