/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Actions from '../../store/actions';
import { AppBar } from '../../components/AppBar';
import AppBarView from '../AppBar';
import Build from '@build-tracker/build';
import buildA from '@build-tracker/fixtures/builds/22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04.json';
import buildB from '@build-tracker/fixtures/builds/01141f29743fb2bdd7e176cf919fc964025cea5a.json';
import { Clipboard } from 'react-native';
import Comparator from '@build-tracker/comparator';
import Drawer from '../../components/Drawer';
import mockStore from '../../store/mock';
import React from 'react';
import { StoreContext } from 'redux-react-hook';
import { fireEvent, render } from 'react-native-testing-library';

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

const initialState = Object.freeze({
  comparator: new Comparator({ builds: [] }),
  comparedRevisions: [],
  sizeKey: '',
  url: 'https://build-tracker.local'
});

describe('AppBarView', () => {
  let drawerRef;
  beforeEach(() => {
    drawerRef = React.createRef();
    render(
      // @ts-ignore
      <Drawer ref={drawerRef}>
        <div />
      </Drawer>
    );
  });

  describe('drawer', () => {
    test('shows the drawer when AppBar pressNavigationIcon hit', () => {
      const showSpy = jest.spyOn(Drawer.prototype, 'show');
      const { getByType } = render(
        <StoreContext.Provider value={mockStore(initialState)}>
          <AppBarView drawerRef={drawerRef} />
        </StoreContext.Provider>
      );
      fireEvent(getByType(AppBar), 'pressNavigationIcon');
      expect(showSpy).toHaveBeenCalled();
    });
  });

  describe('overflow items', () => {
    let clipboardSpy;
    let seededState;
    beforeEach(() => {
      const comparator = new Comparator({
        builds: [new Build(buildA.meta, buildA.artifacts), new Build(buildB.meta, buildB.artifacts)]
      });
      seededState = Object.freeze({
        ...initialState,
        activeArtifacts: comparator.artifactNames.reduce((memo, name) => {
          memo[name] = true;
          return memo;
        }, {}),
        activeComparator: new Comparator({
          builds: [new Build(buildA.meta, buildA.artifacts), new Build(buildB.meta, buildB.artifacts)]
        }),
        comparator,
        comparedRevisions: [buildA.meta.revision, buildB.meta.revision]
      });

      clipboardSpy = jest.spyOn(Clipboard, 'setString').mockImplementation(() => {});
    });

    test('can clear selected revisions', () => {
      const clearComparedSpy = jest.spyOn(Actions, 'clearComparedRevisions');
      const { getByProps } = render(
        <StoreContext.Provider value={mockStore(seededState)}>
          <AppBarView drawerRef={drawerRef} />
        </StoreContext.Provider>
      );

      fireEvent.press(getByProps({ title: 'More actions' }));
      fireEvent.press(getByProps({ label: 'Clear selected revisions' }));
      expect(clearComparedSpy).toHaveBeenCalled();
    });

    test('can copy as markdown', () => {
      const { getByProps } = render(
        <StoreContext.Provider value={mockStore(seededState)}>
          <AppBarView drawerRef={drawerRef} />
        </StoreContext.Provider>
      );

      fireEvent.press(getByProps({ title: 'More actions' }));
      fireEvent.press(getByProps({ label: 'Copy as markdown' }));

      expect(clipboardSpy).toHaveBeenCalledWith(seededState.comparator.toMarkdown());
    });

    test('shows a message when copied as markdown', () => {
      const addSnackSpy = jest.spyOn(Actions, 'addSnack');
      const { getByProps } = render(
        <StoreContext.Provider value={mockStore(seededState)}>
          <AppBarView drawerRef={drawerRef} />
        </StoreContext.Provider>
      );

      fireEvent.press(getByProps({ title: 'More actions' }));
      fireEvent.press(getByProps({ label: 'Copy as markdown' }));
      expect(addSnackSpy).toHaveBeenCalledWith('Copied table as markdown');
    });

    test('can copy as csv', () => {
      const { getByProps } = render(
        <StoreContext.Provider value={mockStore(seededState)}>
          <AppBarView drawerRef={drawerRef} />
        </StoreContext.Provider>
      );

      fireEvent.press(getByProps({ title: 'More actions' }));
      fireEvent.press(getByProps({ label: 'Copy as CSV' }));

      expect(clipboardSpy).toHaveBeenCalledWith(seededState.comparator.toCsv());
    });

    test('shows a message when copied as csv', () => {
      const addSnackSpy = jest.spyOn(Actions, 'addSnack');
      const { getByProps } = render(
        <StoreContext.Provider value={mockStore(seededState)}>
          <AppBarView drawerRef={drawerRef} />
        </StoreContext.Provider>
      );

      fireEvent.press(getByProps({ title: 'More actions' }));
      fireEvent.press(getByProps({ label: 'Copy as CSV' }));
      expect(addSnackSpy).toHaveBeenCalledWith('Copied table as CSV');
    });
  });
});
