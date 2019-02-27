/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import buildDataA from '@build-tracker/fixtures/builds/30af629d1d4c9f2f199cec5f572a019d4198004c.json';
import buildDataB from '@build-tracker/fixtures/builds/22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04.json';
import buildDataC from '@build-tracker/fixtures/builds/243024909db66ac3c3e48d2ffe4015f049609834.json';
import ColorScale from '../../../modules/ColorScale';
import Comparator from '@build-tracker/comparator';
import ComparisonTable from '../ComparisonTable';
import React from 'react';
import { fireEvent, render } from 'react-native-testing-library';

const builds = [
  new Build(buildDataA.meta, buildDataA.artifacts),
  new Build(buildDataB.meta, buildDataB.artifacts),
  new Build(buildDataC.meta, buildDataC.artifacts)
];

describe('ComparisonTable', () => {
  describe('artifact toggling', () => {
    test('artifact off', () => {
      const handleDisableArtifact = jest.fn();
      const comparator = new Comparator({ builds });
      const { getByProps } = render(
        <ComparisonTable
          activeArtifacts={{ vendor: true, main: true }}
          colorScale={ColorScale.Magma}
          comparator={comparator}
          onDisableArtifact={handleDisableArtifact}
          onEnableArtifact={jest.fn()}
          onFocusRevision={jest.fn()}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );
      fireEvent(getByProps({ cell: comparator.matrixBody[2][0] }), 'disable', 'main');
      expect(handleDisableArtifact).toHaveBeenCalledWith('main');
    });

    test('artifact on', () => {
      const handleEnableArtifact = jest.fn();
      const comparator = new Comparator({ builds });
      const { getByProps } = render(
        <ComparisonTable
          activeArtifacts={{ vendor: true, main: false }}
          colorScale={ColorScale.Magma}
          comparator={comparator}
          onDisableArtifact={jest.fn()}
          onEnableArtifact={handleEnableArtifact}
          onFocusRevision={jest.fn()}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );
      fireEvent(getByProps({ cell: comparator.matrixBody[1][0] }), 'enable', 'vendor');
      expect(handleEnableArtifact).toHaveBeenCalledWith('vendor');
    });

    test('all on', () => {
      const handleEnableArtifact = jest.fn();
      const comparator = new Comparator({ builds });
      const { getByProps } = render(
        <ComparisonTable
          activeArtifacts={{ vendor: false, main: false }}
          colorScale={ColorScale.Magma}
          comparator={comparator}
          onDisableArtifact={jest.fn()}
          onEnableArtifact={handleEnableArtifact}
          onFocusRevision={jest.fn()}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );
      fireEvent(getByProps({ cell: comparator.matrixBody[0][0] }), 'enable', 'All');
      expect(handleEnableArtifact).toHaveBeenCalledWith('All');
    });
  });
});
