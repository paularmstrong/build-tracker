/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { BodyRow } from '../BodyRow';
import Build from '@build-tracker/build';
import ColorScale from '../../../modules/ColorScale';
import Comparator from '@build-tracker/comparator';
import ComparisonTable from '../ComparisonTable';
import React from 'react';
import { Table } from '../../Table';
import { fireEvent, render } from 'react-native-testing-library';

const builds = [
  new Build({ branch: 'master', revision: '123', parentRevision: '000', timestamp: 0 }, [
    { name: 'main', hash: '123', sizes: { gzip: 123 } },
    { name: 'vendor', hash: '123', sizes: { gzip: 123 } }
  ]),
  new Build({ branch: 'master', revision: 'abc', parentRevision: '123', timestamp: 0 }, [
    { name: 'main', hash: '123', sizes: { gzip: 123 } },
    { name: 'vendor', hash: '123', sizes: { gzip: 123 } }
  ])
];

describe('ComparisonTable', () => {
  describe('rendering', () => {
    test('when not disabledArtifactsVisible, does not render artifact rows that are disabled', () => {
      const comparator = new Comparator({ builds });
      const { queryAllByProps } = render(
        <ComparisonTable
          activeArtifacts={{ vendor: false, main: true }}
          comparator={comparator}
          colorScale={ColorScale.Cool}
          disabledArtifactsVisible={false}
          hoveredArtifacts={[]}
          onDisableArtifacts={jest.fn()}
          onEnableArtifacts={jest.fn()}
          onFocusArtifacts={jest.fn()}
          onFocusRevision={jest.fn()}
          onHoverArtifacts={jest.fn()}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );

      expect(queryAllByProps({ cell: comparator.matrixArtifacts[0][0] })).toHaveLength(1);
      expect(queryAllByProps({ cell: comparator.matrixArtifacts[1][0] })).toHaveLength(0);
    });

    test('when not disabledArtifactsVisible, still renders groups that are disabled', () => {
      const comparator = new Comparator({ builds, groups: [{ name: 'foobar', artifactNames: ['main', 'vendor'] }] });
      const { queryAllByProps } = render(
        <ComparisonTable
          activeArtifacts={{ vendor: false, main: false }}
          comparator={comparator}
          colorScale={ColorScale.Cool}
          disabledArtifactsVisible={false}
          hoveredArtifacts={[]}
          onDisableArtifacts={jest.fn()}
          onEnableArtifacts={jest.fn()}
          onFocusArtifacts={jest.fn()}
          onFocusRevision={jest.fn()}
          onHoverArtifacts={jest.fn()}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );

      expect(queryAllByProps({ cell: comparator.matrixGroups[0][0] })).toHaveLength(1);
    });
  });

  describe('artifact toggling', () => {
    test('artifacts off', () => {
      const handleDisableArtifacts = jest.fn();
      const comparator = new Comparator({ builds });
      const { getByProps } = render(
        <ComparisonTable
          activeArtifacts={{ vendor: true, main: true }}
          comparator={comparator}
          colorScale={ColorScale.Cool}
          disabledArtifactsVisible
          hoveredArtifacts={[]}
          onDisableArtifacts={handleDisableArtifacts}
          onEnableArtifacts={jest.fn()}
          onFocusArtifacts={jest.fn()}
          onFocusRevision={jest.fn()}
          onHoverArtifacts={jest.fn()}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );
      fireEvent(getByProps({ cell: comparator.matrixArtifacts[1][0] }), 'disable', 'main');
      expect(handleDisableArtifacts).toHaveBeenCalledWith(['main']);
    });

    test('artifacts on', () => {
      const handleEnableArtifacts = jest.fn();
      const comparator = new Comparator({ builds });
      const { getByProps } = render(
        <ComparisonTable
          activeArtifacts={{ vendor: true, main: false }}
          comparator={comparator}
          colorScale={ColorScale.Cool}
          disabledArtifactsVisible
          hoveredArtifacts={[]}
          onDisableArtifacts={jest.fn()}
          onEnableArtifacts={handleEnableArtifacts}
          onFocusArtifacts={jest.fn()}
          onFocusRevision={jest.fn()}
          onHoverArtifacts={jest.fn()}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );
      fireEvent(getByProps({ cell: comparator.matrixArtifacts[1][0] }), 'enable', 'vendor');
      expect(handleEnableArtifacts).toHaveBeenCalledWith(['vendor']);
    });

    test('focus', () => {
      const handleFocusArtifacts = jest.fn();
      const comparator = new Comparator({ builds });
      const { getByProps } = render(
        <ComparisonTable
          activeArtifacts={{ vendor: true, main: false }}
          comparator={comparator}
          colorScale={ColorScale.Cool}
          disabledArtifactsVisible
          hoveredArtifacts={[]}
          onDisableArtifacts={jest.fn()}
          onEnableArtifacts={jest.fn()}
          onFocusArtifacts={handleFocusArtifacts}
          onFocusRevision={jest.fn()}
          onHoverArtifacts={jest.fn()}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );
      fireEvent(getByProps({ cell: comparator.matrixArtifacts[1][0] }), 'focusArtifact', 'vendor');
      expect(handleFocusArtifacts).toHaveBeenCalledWith(['vendor']);
    });
  });

  describe('hovering', () => {
    test('sets singular artifacts to hovered', () => {
      const handleHoverArtifacts = jest.fn();
      const comparator = new Comparator({ builds });
      const { queryAllByType } = render(
        <ComparisonTable
          activeArtifacts={{ vendor: false, main: false }}
          comparator={comparator}
          colorScale={ColorScale.Cool}
          disabledArtifactsVisible
          hoveredArtifacts={[]}
          onDisableArtifacts={jest.fn()}
          onEnableArtifacts={jest.fn()}
          onFocusArtifacts={jest.fn()}
          onFocusRevision={jest.fn()}
          onHoverArtifacts={handleHoverArtifacts}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );
      fireEvent(queryAllByType(BodyRow)[0], 'hoverArtifact', 'main');
      expect(handleHoverArtifacts).toHaveBeenCalledWith(['main']);
    });

    test('disables hovered artifact on mouse out', () => {
      const handleHoverArtifacts = jest.fn();
      const comparator = new Comparator({ builds });
      const { getByType } = render(
        <ComparisonTable
          activeArtifacts={{ vendor: false, main: false }}
          comparator={comparator}
          colorScale={ColorScale.Cool}
          disabledArtifactsVisible
          hoveredArtifacts={[]}
          onDisableArtifacts={jest.fn()}
          onEnableArtifacts={jest.fn()}
          onFocusArtifacts={jest.fn()}
          onFocusRevision={jest.fn()}
          onHoverArtifacts={handleHoverArtifacts}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );
      fireEvent(getByType(Table), 'mouseLeave');
      expect(handleHoverArtifacts).toHaveBeenCalledWith([]);
    });

    test('sets to empty array when hovering artifactName is falsy', () => {
      const handleHoverArtifacts = jest.fn();
      const comparator = new Comparator({ builds });
      const { queryAllByType } = render(
        <ComparisonTable
          activeArtifacts={{ vendor: false, main: false }}
          comparator={comparator}
          colorScale={ColorScale.Cool}
          disabledArtifactsVisible
          hoveredArtifacts={[]}
          onDisableArtifacts={jest.fn()}
          onEnableArtifacts={jest.fn()}
          onFocusArtifacts={jest.fn()}
          onFocusRevision={jest.fn()}
          onHoverArtifacts={handleHoverArtifacts}
          onRemoveRevision={jest.fn()}
          sizeKey="stat"
        />
      );
      fireEvent(queryAllByType(BodyRow)[0], 'hoverArtifact', null);
      expect(handleHoverArtifacts).toHaveBeenCalledWith([]);
    });
  });
});
