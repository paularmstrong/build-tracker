/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Actions from '../../store/actions';
import Build from '@build-tracker/build';
import BuildInfo from '../BuildInfo';
import Comparator from '@build-tracker/comparator';
import mockStore from '../../store/mock';
import { Provider } from 'react-redux';
import React from 'react';
import TextLink from '../TextLink';
import { fireEvent, render } from 'react-native-testing-library';

const build = new Build({ branch: 'master', revision: '1234565', parentRevision: 'abcdef', timestamp: 123 }, []);

describe('BuildInfo', () => {
  test('can be closed', () => {
    const focusRevisionSpy = jest.spyOn(Actions, 'setFocusedRevision');
    const { getByProps } = render(
      <Provider store={mockStore({ comparator: new Comparator({ builds: [build] }) })}>
        <BuildInfo focusedRevision="1234565" />
      </Provider>
    );
    fireEvent.press(getByProps({ title: 'Collapse details' }));
    expect(focusRevisionSpy).toHaveBeenCalledWith(undefined);
  });

  test('renders a text link if the revision has a URL', () => {
    const buildA = new Build(
      {
        branch: 'master',
        revision: {
          value: '123456',
          url: 'https://github.com/paularmstrong/build-tracker/commit/123456'
        },
        parentRevision: 'abcdef',
        timestamp: 123
      },
      []
    );
    const { getByType } = render(
      <Provider store={mockStore({ comparator: new Comparator({ builds: [buildA] }) })}>
        <BuildInfo focusedRevision="123456" />
      </Provider>
    );
    expect(getByType(TextLink).props).toMatchObject({
      href: 'https://github.com/paularmstrong/build-tracker/commit/123456',
      text: '123456'
    });
  });

  test('renders a text link for other keys that have a URL', () => {
    const buildA = new Build(
      {
        branch: 'master',
        revision: '123456',
        parentRevision: {
          value: 'abcdef',
          url: 'https://github.com/paularmstrong/build-tracker/commit/abcdef'
        },
        timestamp: 123
      },
      []
    );
    const { getByType } = render(
      <Provider store={mockStore({ comparator: new Comparator({ builds: [buildA] }) })}>
        <BuildInfo focusedRevision="123456" />
      </Provider>
    );
    expect(getByType(TextLink).props).toMatchObject({
      href: 'https://github.com/paularmstrong/build-tracker/commit/abcdef',
      text: 'abcdef'
    });
  });

  test('removes the build focus on button press', () => {
    const removeComparedRevisionSpy = jest.spyOn(Actions, 'removeComparedRevision');
    const { getByProps } = render(
      <Provider store={mockStore({ comparator: new Comparator({ builds: [build] }) })}>
        <BuildInfo focusedRevision="1234565" />
      </Provider>
    );
    fireEvent.press(getByProps({ title: 'Remove build' }));
    expect(removeComparedRevisionSpy).toHaveBeenCalledWith('1234565');
  });
});
