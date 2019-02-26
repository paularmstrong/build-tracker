/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { act } from 'react-dom/test-utils';
import AppBar from '../../components/AppBar';
import ColorScale from '../../modules/ColorScale';
import ColorScalePicker from '../../components/ColorScalePicker';
import ComparisonTable from '../../components/ComparisonTable';
import Drawer from '../../components/Drawer';
import Graph from '../../components/Graph';
import Main from '../Main';
import React from 'react';
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
});
