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
import { fireEvent, render } from 'react-native-testing-library';

const build = new Build({ branch: 'main', revision: '1234565', parentRevision: 'abcdef', timestamp: 123 }, []);

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
