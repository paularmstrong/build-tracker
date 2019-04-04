/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Actions from '../../store/actions';
import * as CrossFetch from 'cross-fetch';
import Build from '@build-tracker/build';
import buildA from '@build-tracker/fixtures/builds/22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04.json';
import buildB from '@build-tracker/fixtures/builds/01141f29743fb2bdd7e176cf919fc964025cea5a.json';
import buildC from '@build-tracker/fixtures/builds/243024909db66ac3c3e48d2ffe4015f049609834.json';
import Comparator from '@build-tracker/comparator';
import Comparison from '../../views/Comparison';
import Main from '../Main';
import mockStore from '../../store/mock';
import React from 'react';
import { StoreContext } from 'redux-react-hook';
import { flushMicrotasksQueue, render } from 'react-native-testing-library';

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
  let fetchSpy;
  beforeEach(() => {
    fetchSpy = jest.spyOn(CrossFetch, 'fetch').mockImplementation(() =>
      // @ts-ignore
      Promise.resolve({
        json: () => [buildA, buildB, buildC]
      })
    );
  });

  describe('startup', () => {
    test('fetches builds and updates', async () => {
      const setBuildsSpy = jest.spyOn(Actions, 'setBuilds');
      const component = (
        <StoreContext.Provider
          value={mockStore({
            builds: [],
            comparedRevisions: [],
            comparator: new Comparator({ builds: [] }),
            snacks: [],
            url
          })}
        >
          <Main />
        </StoreContext.Provider>
      );
      const { update } = render(component);
      update(component);
      await flushMicrotasksQueue();
      expect(fetchSpy).toHaveBeenCalledWith(`${url}/api/builds`);
      expect(setBuildsSpy).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Build), expect.any(Build), expect.any(Build)])
      );
    });
  });

  describe('comparison view', () => {
    test('shows when there are compared revisions', async () => {
      const store = mockStore({
        builds: [new Build(buildA.meta, buildA.artifacts)],
        comparedRevisions: [buildA.meta.revision],
        comparator: new Comparator({ builds: [new Build(buildA.meta, buildA.artifacts)] }),
        snacks: [],
        url
      });
      const component = (
        <StoreContext.Provider value={store}>
          <Main />
        </StoreContext.Provider>
      );
      const { queryAllByType } = render(component);
      await flushMicrotasksQueue();
      expect(queryAllByType(Comparison)).toHaveLength(1);
    });
  });
});
