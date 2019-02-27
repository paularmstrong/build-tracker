/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { act } from 'react-dom/test-utils';
import AppBar from '../../components/AppBar';
import BuildInfo from '../../components/BuildInfo';
import ColorScale from '../../modules/ColorScale';
import ColorScalePicker from '../../components/ColorScalePicker';
import ComparisonTable from '../../components/ComparisonTable';
import Drawer from '../../components/Drawer';
import Graph from '../../components/Graph';
import Main from '../Main';
import React from 'react';
import SizeKeyPicker from '../../components/SizeKeyPicker';
import { fireEvent, render } from 'react-native-testing-library';

// React.memo components are not findable by type
jest.mock('../../components/ColorScalePicker', () => {
  const actual = jest.requireActual('../../components/ColorScalePicker');
  return actual.ColorScalePicker;
});

jest.mock('../../components/AppBar', () => {
  const actual = jest.requireActual('../../components/AppBar');
  return actual.AppBar;
});

jest.mock('../../components/Drawer', () => {
  const React = jest.requireActual('react');
  interface Props {
    children: React.ReactElement;
  }
  class Drawer extends React.Component<Props> {
    public render(): React.ReactElement {
      return <>{this.props.children}</>;
    }
    public show(): void {}
  }
  return Drawer;
});

describe('Main', () => {
  describe('drawer', () => {
    test('shows the drawer when AppBar pressNavigationIcon hit', () => {
      const showSpy = jest.spyOn(Drawer.prototype, 'show');
      const { getByType } = render(<Main />);
      act(() => {
        fireEvent(getByType(AppBar), 'pressNavigationIcon');
      });
      expect(showSpy).toHaveBeenCalled();
    });
  });

  describe('color scale', () => {
    test('sets color scale context when scale is selected', () => {
      const { getByType } = render(<Main />);
      act(() => {
        fireEvent(getByType(ColorScalePicker), 'select', ColorScale.Magma);
      });
      expect(getByType(ColorScalePicker).props.activeColorScale).toBe(ColorScale.Magma);
      expect(getByType(ComparisonTable).props.colorScale).toBe(ColorScale.Magma);
      expect(getByType(Graph).props.colorScale).toBe(ColorScale.Magma);
    });
  });

  describe('artifacts', () => {
    test('can disable all artifacts', () => {
      const { getByType } = render(<Main />);
      act(() => {
        fireEvent(getByType(ComparisonTable), 'disableArtifact', 'All');
      });
      expect(Object.values(getByType(ComparisonTable).props.activeArtifacts)).not.toEqual(
        expect.arrayContaining([true])
      );
      expect(Object.values(getByType(Graph).props.activeArtifacts)).not.toEqual(expect.arrayContaining([true]));
    });

    test('can disable a single artifact', () => {
      const { getByType } = render(<Main />);
      act(() => {
        fireEvent(getByType(ComparisonTable), 'disableArtifact', 'main');
      });
      expect(getByType(ComparisonTable).props.activeArtifacts).toMatchObject({
        main: false,
        vendor: true,
        shared: true
      });
      expect(getByType(Graph).props.activeArtifacts).toMatchObject({ main: false, vendor: true, shared: true });
    });

    test('can enable all artifacts', () => {
      const { getByType } = render(<Main />);
      act(() => {
        fireEvent(getByType(ComparisonTable), 'disableArtifact', 'All');
        fireEvent(getByType(ComparisonTable), 'enableArtifact', 'All');
      });
      expect(Object.values(getByType(ComparisonTable).props.activeArtifacts)).not.toEqual(
        expect.arrayContaining([false])
      );
      expect(Object.values(getByType(Graph).props.activeArtifacts)).not.toEqual(expect.arrayContaining([false]));
    });

    test('can enable a single artifact', () => {
      const { getByType } = render(<Main />);
      act(() => {
        fireEvent(getByType(ComparisonTable), 'disableArtifact', 'All');
        fireEvent(getByType(ComparisonTable), 'enableArtifact', 'main');
      });
      expect(getByType(ComparisonTable).props.activeArtifacts).toMatchObject({
        main: true,
        vendor: false,
        shared: false
      });
      expect(getByType(Graph).props.activeArtifacts).toMatchObject({ main: true, vendor: false, shared: false });
    });
  });

  describe('on select size key', () => {
    test('passes the new size key to graph and table', () => {
      const { getByType, queryAllByProps } = render(<Main />);
      act(() => {
        fireEvent(getByType(SizeKeyPicker), 'select', 'stat');
      });

      expect(queryAllByProps({ sizeKey: 'stat' })).toHaveLength(2);
      expect(queryAllByProps({ sizeKey: 'gzip' })).toHaveLength(0);
    });
  });

  describe('on select revision', () => {
    test('updates the comparison table', () => {
      const { getByType } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '243024909db66ac3c3e48d2ffe4015f049609834');
      });
      expect(getByType(ComparisonTable).props.comparator.builds.map(b => b.getMetaValue('revision'))).toEqual([
        '243024909db66ac3c3e48d2ffe4015f049609834'
      ]);
    });
  });

  describe('focused revisions', () => {
    test('focusing a revision shows the build info', () => {
      const { getByType, queryByTestId } = render(<Main />);
      expect(queryByTestId('buildinfo')).toBeNull();
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
        fireEvent(getByType(ComparisonTable), 'focusRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      });

      expect(queryByTestId('buildinfo')).not.toBeNull();
    });

    test('removing a revision hides the build info', () => {
      const { getByType, queryByTestId } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
        fireEvent(getByType(ComparisonTable), 'removeRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      });

      expect(queryByTestId('buildinfo')).toBeNull();
    });

    test('removing focused revision hides the build info', () => {
      const { getByType, queryByTestId } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
        fireEvent(getByType(ComparisonTable), 'focusRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
        fireEvent(getByType(ComparisonTable), 'removeRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      });

      expect(queryByTestId('buildinfo')).toBeNull();
    });

    test('closing the build info removes the component', () => {
      const { getByType, queryByTestId } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
        fireEvent(getByType(ComparisonTable), 'focusRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
        fireEvent(getByType(BuildInfo), 'close');
      });

      expect(queryByTestId('buildinfo')).toBeNull();
    });
  });
});
