/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { act } from 'react-dom/test-utils';
import AppBar from '../../components/AppBar';
import BuildInfo from '../../components/BuildInfo';
import { Clipboard } from 'react-native';
import ColorScale from '../../modules/ColorScale';
import ColorScalePicker from '../../components/ColorScalePicker';
import Comparison from '../../views/Comparison';
import Drawer from '../../components/Drawer';
import Graph from '../../components/Graph';
import Main from '../Main';
import React from 'react';
import SizeKeyPicker from '../../components/SizeKeyPicker';
import { fireEvent, flushMicrotasksQueue, render } from 'react-native-testing-library';

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
    test('sets color scale context when scale is selected', async () => {
      const { getByType } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
        fireEvent(getByType(ColorScalePicker), 'select', ColorScale.Magma);
      });
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      expect(getByType(ColorScalePicker).props.activeColorScale).toBe(ColorScale.Magma);
      expect(getByType(Comparison).props.colorScale).toBe(ColorScale.Magma);
      expect(getByType(Graph).props.colorScale).toBe(ColorScale.Magma);
    });
  });

  describe('artifacts', () => {
    test('can disable a artifacts', async () => {
      const { getByType } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      });
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      act(() => {
        fireEvent(getByType(Comparison), 'disableArtifacts', ['main']);
      });
      expect(getByType(Comparison).props.activeArtifacts).toMatchObject({
        main: false,
        vendor: true,
        shared: true
      });
      expect(getByType(Graph).props.activeArtifacts).toMatchObject({ main: false, vendor: true, shared: true });
    });

    test('can enable a artifacts', async () => {
      const { getByType } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      });
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      act(() => {
        fireEvent(getByType(Comparison), 'disableArtifacts', ['main', 'vendor', 'shared']);
        fireEvent(getByType(Comparison), 'enableArtifacts', ['main']);
      });
      expect(getByType(Comparison).props.activeArtifacts).toMatchObject({
        main: true,
        vendor: false,
        shared: false
      });
      expect(getByType(Graph).props.activeArtifacts).toMatchObject({ main: true, vendor: false, shared: false });
    });

    test('can toggle visibility of disabled artifacts', async () => {
      const { getByType, queryAllByProps } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      });
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      expect(queryAllByProps({ disabledArtifactsVisible: true })).toHaveLength(3);
      act(() => {
        fireEvent(getByType(Drawer), 'toggleDisabledArtifacts', false);
      });

      expect(queryAllByProps({ disabledArtifactsVisible: false })).toHaveLength(3);
    });
  });

  describe('on select size key', () => {
    test('passes the new size key to graph', async () => {
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
      expect(getByType(Comparison).props.comparator.builds.map(b => b.getMetaValue('revision'))).toEqual([
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
        fireEvent(getByType(Comparison), 'focusRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      });

      expect(queryByTestId('buildinfo')).not.toBeNull();
    });

    test('removing a revision hides the build info', () => {
      const { getByType, queryByTestId } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
        fireEvent(getByType(Comparison), 'removeRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      });

      expect(queryByTestId('buildinfo')).toBeNull();
    });

    test('removing focused revision hides the build info', () => {
      const { getByType, queryByTestId } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
        fireEvent(getByType(Comparison), 'focusRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
        fireEvent(getByType(Comparison), 'removeRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      });

      expect(queryByTestId('buildinfo')).toBeNull();
    });

    test('closing the build info removes the component', () => {
      const { getByType, queryByTestId } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
        fireEvent(getByType(Comparison), 'focusRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
        fireEvent(getByType(BuildInfo), 'close');
      });

      expect(queryByTestId('buildinfo')).toBeNull();
    });
  });

  describe('overflow items', () => {
    test('can clear selected revisions', async () => {
      const { getByType, queryAllByType } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '243024909db66ac3c3e48d2ffe4015f049609834');
      });
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      expect(queryAllByType(Comparison)).toHaveLength(1);

      act(() => {
        fireEvent.press(getByType(AppBar).props.overflowItems[0]);
      });

      expect(queryAllByType(Comparison)).toHaveLength(0);
    });

    test('can copy as markdown', async () => {
      const clipboardSpy = jest.spyOn(Clipboard, 'setString').mockImplementation(() => {});
      const { getByType, queryAllByType } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '243024909db66ac3c3e48d2ffe4015f049609834');
      });
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      expect(queryAllByType(Comparison)).toHaveLength(1);

      act(() => {
        fireEvent.press(getByType(AppBar).props.overflowItems[1]);
      });
      const comparator = getByType(Comparison).props.comparator;

      expect(clipboardSpy).toHaveBeenCalledWith(comparator.toMarkdown());
    });

    test('can copy as csv', async () => {
      const clipboardSpy = jest.spyOn(Clipboard, 'setString').mockImplementation(() => {});
      const { getByType, queryAllByType } = render(<Main />);
      act(() => {
        fireEvent(getByType(Graph), 'selectRevision', '243024909db66ac3c3e48d2ffe4015f049609834');
      });
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      expect(queryAllByType(Comparison)).toHaveLength(1);

      act(() => {
        fireEvent.press(getByType(AppBar).props.overflowItems[2]);
      });

      const comparator = getByType(Comparison).props.comparator;

      expect(clipboardSpy).toHaveBeenCalledWith(comparator.toCsv());
    });
  });
});
