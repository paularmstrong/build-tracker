/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Actions from '../../store/actions';
import Build from '@build-tracker/build';
import BuildInfo from '../BuildInfo';
import Comparator from '@build-tracker/comparator';
import mockStore from '../../store/mock';
import React from 'react';
import { StoreContext } from 'redux-react-hook';
import { fireEvent, render } from '@testing-library/react';

const build = new Build({ branch: 'master', revision: '1234565', parentRevision: 'abcdef', timestamp: 123 }, []);

describe('BuildInfo', () => {
  test('can be closed', () => {
    const focusRevisionSpy = jest.spyOn(Actions, 'setFocusedRevision');
    const { getByRole } = render(
      <StoreContext.Provider value={mockStore({ comparator: new Comparator({ builds: [build] }) })}>
        <BuildInfo focusedRevision="1234565" />
      </StoreContext.Provider>
    );
    fireEvent.touchStart(getByRole('button'));
    fireEvent.touchEnd(getByRole('button'));
    expect(focusRevisionSpy).toHaveBeenCalledWith(undefined);
  });
});
