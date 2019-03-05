/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import ColorScale from '../../../modules/ColorScale';
import Comparator from '@build-tracker/comparator';
import ComparisonTable from '../ComparisonTable';
import React from 'react';
import { Table } from '../../Table';
import { fireEvent, render } from 'react-native-testing-library';

const builds = [
  new Build({ revision: '123', parentRevision: '000', timestamp: 0 }, [
    { name: 'main', hash: '123', sizes: { gzip: 123 } },
    { name: 'vendor', hash: '123', sizes: { gzip: 123 } }
  ]),
  new Build({ revision: 'abc', parentRevision: '123', timestamp: 0 }, [
    { name: 'main', hash: '123', sizes: { gzip: 123 } },
    { name: 'vendor', hash: '123', sizes: { gzip: 123 } }
  ])
];

describe('ComparisonTable', () => {
  describe('rendering', () => {
    test('when disabledArtifactsVisible, does not render artifact rows that are disabled', () => {
      const comparator = new Comparator({ builds });
      const { queryAllByProps } = render(
        <ComparisonTable
          activeArtifacts={{ vendor: false, main: true }}
          colorScale={ColorScale.Magma}
          comparator={comparator}
          disabledArtifactsVisible={false}
          hoveredArtifact={null}
          onDisableArtifact={jest.fn()}
          onEnableArtifact={jest.fn()}
          onFocusRevision={jest.fn()}
          onHoverArtifact={jest.fn()}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );

      expect(queryAllByProps({ cell: comparator.matrixArtifacts[0][0] })).toHaveLength(1);
      expect(queryAllByProps({ cell: comparator.matrixArtifacts[1][0] })).toHaveLength(0);
    });
  });

  describe('artifact toggling', () => {
    test('artifact off', () => {
      const handleDisableArtifact = jest.fn();
      const comparator = new Comparator({ builds });
      const { getByProps } = render(
        <ComparisonTable
          activeArtifacts={{ vendor: true, main: true }}
          colorScale={ColorScale.Magma}
          comparator={comparator}
          disabledArtifactsVisible
          hoveredArtifact={null}
          onDisableArtifact={handleDisableArtifact}
          onEnableArtifact={jest.fn()}
          onFocusRevision={jest.fn()}
          onHoverArtifact={jest.fn()}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );
      fireEvent(getByProps({ cell: comparator.matrixArtifacts[1][0] }), 'disable', 'main');
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
          disabledArtifactsVisible
          hoveredArtifact={null}
          onDisableArtifact={jest.fn()}
          onEnableArtifact={handleEnableArtifact}
          onFocusRevision={jest.fn()}
          onHoverArtifact={jest.fn()}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );
      fireEvent(getByProps({ cell: comparator.matrixArtifacts[1][0] }), 'enable', 'vendor');
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
          disabledArtifactsVisible
          hoveredArtifact={null}
          onDisableArtifact={jest.fn()}
          onEnableArtifact={handleEnableArtifact}
          onFocusRevision={jest.fn()}
          onHoverArtifact={jest.fn()}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );
      fireEvent(getByProps({ cell: comparator.matrixArtifacts[0][0] }), 'enable', 'All');
      expect(handleEnableArtifact).toHaveBeenCalledWith('All');
    });
  });

  test('disables hovered artifact on mouse out', () => {
    const handleHoverArtifact = jest.fn();
    const comparator = new Comparator({ builds });
    const { getByType } = render(
      <ComparisonTable
        activeArtifacts={{ vendor: false, main: false }}
        colorScale={ColorScale.Magma}
        comparator={comparator}
        disabledArtifactsVisible
        hoveredArtifact={null}
        onDisableArtifact={jest.fn()}
        onEnableArtifact={jest.fn()}
        onFocusRevision={jest.fn()}
        onHoverArtifact={handleHoverArtifact}
        onRemoveRevision={jest.fn()}
        sizeKey="stat"
      />
    );
    fireEvent(getByType(Table), 'mouseLeave');
    expect(handleHoverArtifact).toHaveBeenCalledWith(null);
  });
});
