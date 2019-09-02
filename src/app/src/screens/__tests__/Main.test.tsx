/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import buildA from '@build-tracker/fixtures/builds/22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04.json';
import Comparator from '@build-tracker/comparator';
import Comparison from '../../views/Comparison';
import Main from '../Main';
import mockStore from '../../store/mock';
import { Provider } from 'react-redux';
import React from 'react';
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

const url = 'https://build-tracker.local';

describe('Main', () => {
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
        <Provider store={store}>
          <Main />
        </Provider>
      );
      const { queryAllByType } = render(component);
      await flushMicrotasksQueue();
      expect(queryAllByType(Comparison)).toHaveLength(1);
    });
  });
});
