/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as CrossFetch from 'cross-fetch';
import AppBar from '../../components/AppBar';
import buildA from '@build-tracker/fixtures/builds/22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04.json';
import buildB from '@build-tracker/fixtures/builds/01141f29743fb2bdd7e176cf919fc964025cea5a.json';
import buildC from '@build-tracker/fixtures/builds/243024909db66ac3c3e48d2ffe4015f049609834.json';
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

jest.mock('../../components/Graph', () => {
  return () => null;
});

jest.mock('../../views/Comparison', () => {
  return () => null;
});

jest.mock('cross-fetch', () => {
  return {
    fetch: jest.fn()
  };
});

const url = 'https://build-tracker.local';

describe('Main', () => {
  beforeEach(() => {
    jest.spyOn(CrossFetch, 'fetch').mockImplementation(() =>
      // @ts-ignore
      Promise.resolve({
        json: () => [buildA, buildB, buildC]
      })
    );
  });

  describe('drawer', () => {
    test('shows the drawer when AppBar pressNavigationIcon hit', () => {
      const showSpy = jest.spyOn(Drawer.prototype, 'show');
      const { getByType } = render(<Main url={url} />);
      fireEvent(getByType(AppBar), 'pressNavigationIcon');
      expect(showSpy).toHaveBeenCalled();
    });
  });

  describe('color scale', () => {
    test('sets color scale context when scale is selected', async () => {
      const { getByType } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      fireEvent(getByType(ColorScalePicker), 'select', ColorScale.Magma);
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      expect(getByType(ColorScalePicker).props.activeColorScale).toBe(ColorScale.Magma);
      expect(getByType(Comparison).props.colorScale).toBe(ColorScale.Magma);
      expect(getByType(Graph).props.colorScale).toBe(ColorScale.Magma);
    });
  });

  describe('artifacts', () => {
    test('can disable a artifacts', async () => {
      const { getByType } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      fireEvent(getByType(Comparison), 'disableArtifacts', ['main']);
      expect(getByType(Comparison).props.activeArtifacts).toMatchObject({
        main: false,
        vendor: true,
        shared: true
      });
      expect(getByType(Graph).props.activeArtifacts).toMatchObject({ main: false, vendor: true, shared: true });
    });

    test('can enable a artifacts', async () => {
      const { getByType } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      fireEvent(getByType(Comparison), 'disableArtifacts', ['main', 'vendor', 'shared']);
      fireEvent(getByType(Comparison), 'enableArtifacts', ['main']);
      expect(getByType(Comparison).props.activeArtifacts).toMatchObject({
        main: true,
        vendor: false,
        shared: false
      });
      expect(getByType(Graph).props.activeArtifacts).toMatchObject({ main: true, vendor: false, shared: false });
    });

    test('can focus artifacts', async () => {
      const { getByType } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      fireEvent(getByType(Comparison), 'focusArtifacts', ['main', 'vendor']);
      expect(getByType(Comparison).props.activeArtifacts).toMatchObject({
        main: true,
        vendor: true,
        shared: false
      });
      expect(getByType(Graph).props.activeArtifacts).toMatchObject({ main: true, vendor: true, shared: false });
    });

    test('can toggle visibility of disabled artifacts', async () => {
      const { getByType, queryAllByProps } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      expect(queryAllByProps({ disabledArtifactsVisible: true })).toHaveLength(2);
      fireEvent(getByType(Drawer), 'toggleDisabledArtifacts', false);

      expect(queryAllByProps({ disabledArtifactsVisible: false })).toHaveLength(2);
    });
  });

  describe('on select size key', () => {
    test('passes the new size key to graph', async () => {
      const { getByType, queryAllByProps } = render(<Main url={url} />);
      fireEvent(getByType(SizeKeyPicker), 'select', 'stat');
      expect(queryAllByProps({ sizeKey: 'stat' })).toHaveLength(2);
      expect(queryAllByProps({ sizeKey: 'gzip' })).toHaveLength(0);
    });
  });

  describe('hovering artifacts', () => {
    test('updates hovered artifacts', async () => {
      const { getByType } = render(<Main url={url} />);
      expect(getByType(Graph).props.hoveredArtifacts).toEqual([]);
      fireEvent(getByType(Graph), 'hoverArtifacts', ['main']);
      expect(getByType(Graph).props.hoveredArtifacts).toEqual(['main']);
    });

    test('does not update hovered artifacts if equal', async () => {
      const { getByType } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'hoverArtifacts', ['main']);
      const { hoveredArtifacts } = getByType(Graph).props;
      fireEvent(getByType(Graph), 'hoverArtifacts', ['main']);
      expect(getByType(Graph).props.hoveredArtifacts).toBe(hoveredArtifacts);
    });
  });

  describe('on select revision', () => {
    test('updates the comparison table', async () => {
      const { getByType } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      fireEvent(getByType(Graph), 'selectRevision', '243024909db66ac3c3e48d2ffe4015f049609834');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      expect(getByType(Comparison).props.comparator.builds.map(b => b.getMetaValue('revision'))).toEqual(
        expect.arrayContaining(['243024909db66ac3c3e48d2ffe4015f049609834', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04'])
      );
    });
  });

  describe('focused revisions', () => {
    test('focusing a revision shows the build info', async () => {
      const { getByType, queryAllByProps } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      fireEvent(getByType(Comparison), 'focusRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded

      expect(queryAllByProps({ focusedRevision: '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04' })).toHaveLength(1);
    });

    test('removing focused revision hides the build info', async () => {
      const { getByType, queryAllByProps } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      fireEvent(getByType(Graph), 'selectRevision', '243024909db66ac3c3e48d2ffe4015f049609834');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      fireEvent(getByType(Comparison), 'focusRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      fireEvent(getByType(Comparison), 'removeRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');

      expect(queryAllByProps({ focusedRevision: null })).toHaveLength(1);
    });

    test('closing the build info removes the component', async () => {
      const { getByType, queryAllByProps } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      fireEvent(getByType(Comparison), 'focusRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      fireEvent(getByType(Comparison), 'unfocusRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');

      expect(queryAllByProps({ focusedRevision: null })).toHaveLength(1);
    });
  });

  describe('overflow items', () => {
    let clipboardSpy;
    beforeEach(() => {
      clipboardSpy = jest.spyOn(Clipboard, 'setString').mockImplementation(() => {});
    });

    test('can clear selected revisions', async () => {
      const { getByType, getByProps, queryAllByType } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '243024909db66ac3c3e48d2ffe4015f049609834');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded

      fireEvent.press(getByProps({ title: 'More actions' }));
      fireEvent.press(getByProps({ label: 'Clear selected revisions' }));

      expect(queryAllByType(Comparison)).toHaveLength(0);
    });

    test('can copy as markdown', async () => {
      const { getByType, getByProps } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded
      fireEvent(getByType(Graph), 'selectRevision', '243024909db66ac3c3e48d2ffe4015f049609834');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded

      fireEvent.press(getByProps({ title: 'More actions' }));
      fireEvent.press(getByProps({ label: 'Copy as markdown' }));
      const comparator = getByType(Comparison).props.comparator;

      expect(clipboardSpy).toHaveBeenCalledWith(comparator.toMarkdown());
    });

    test('shows a message when copied as markdown', async () => {
      const { getByProps, getByType, queryAllByProps, queryAllByText } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded

      fireEvent.press(getByProps({ title: 'More actions' }));
      fireEvent.press(getByProps({ label: 'Copy as markdown' }));

      expect(queryAllByProps({ accessibilityRole: 'alert' })).toHaveLength(1);
      expect(queryAllByText('Copied table as markdown')).toHaveLength(1);
    });

    test('can copy as csv', async () => {
      const { getByProps, getByType } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '243024909db66ac3c3e48d2ffe4015f049609834');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded

      fireEvent.press(getByProps({ title: 'More actions' }));
      fireEvent.press(getByProps({ label: 'Copy as CSV' }));

      const comparator = getByType(Comparison).props.comparator;

      expect(clipboardSpy).toHaveBeenCalledWith(comparator.toCsv());
    });

    test('shows a message when copied as csv', async () => {
      const { getByProps, getByType, queryAllByProps, queryAllByText } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded

      fireEvent.press(getByProps({ title: 'More actions' }));
      fireEvent.press(getByProps({ label: 'Copy as CSV' }));

      expect(queryAllByProps({ accessibilityRole: 'alert' })).toHaveLength(1);
      expect(queryAllByText('Copied table as CSV')).toHaveLength(1);
    });
  });

  describe('messages', () => {
    test('removes messages after some time ', async () => {
      jest.spyOn(Clipboard, 'setString').mockImplementation(() => {});
      const { getByProps, getByType, queryAllByProps, update } = render(<Main url={url} />);
      fireEvent(getByType(Graph), 'selectRevision', '22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04');
      await flushMicrotasksQueue(); // ensure dynamic imports are loaded

      fireEvent.press(getByProps({ title: 'More actions' }));
      fireEvent.press(getByProps({ label: 'Copy as CSV' }));

      expect(queryAllByProps({ accessibilityRole: 'alert' })).toHaveLength(1);
      update(<Main url={url} />);
      jest.runAllTimers();
      expect(queryAllByProps({ accessibilityRole: 'alert' })).toHaveLength(0);
    });
  });
});
