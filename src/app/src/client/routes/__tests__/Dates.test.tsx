/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Actions from '../../../store/actions';
import * as CrossFetch from 'cross-fetch';
import Build from '@build-tracker/build';
import buildA from '@build-tracker/fixtures/builds/22abb6f829a07ca96ff56deeadf4d0e8fc2dbb04.json';
import buildB from '@build-tracker/fixtures/builds/01141f29743fb2bdd7e176cf919fc964025cea5a.json';
import buildC from '@build-tracker/fixtures/builds/243024909db66ac3c3e48d2ffe4015f049609834.json';
import Dates from '../Dates';
import { FetchState } from '../../../store/types';
import mockStore from '../../../store/mock';
import { Provider } from 'react-redux';
import React from 'react';
import { flushMicrotasksQueue, render } from 'react-native-testing-library';

const url = 'https://build-tracker.local';

jest.mock('cross-fetch', () => {
  return {
    fetch: jest.fn()
  };
});

const renderLimit = async (startTimestamp: string = '100', endTimestamp: string = '200'): Promise<void> => {
  render(
    <Provider
      store={mockStore({
        builds: [],
        comparedRevisions: [],
        snacks: [],
        url
      })}
    >
      <Dates
        // @ts-ignore
        match={{ params: { startTimestamp, endTimestamp } }}
      />
    </Provider>
  );
  await flushMicrotasksQueue();
};

describe('Dates', () => {
  let fetchSpy, setFetchStateSpy, setBuildsSpy;
  beforeEach(() => {
    fetchSpy = jest.spyOn(CrossFetch, 'fetch').mockImplementation(() =>
      // @ts-ignore
      Promise.resolve({
        json: () => Promise.resolve([buildA, buildB, buildC])
      })
    );
    setFetchStateSpy = jest.spyOn(Actions, 'setFetchState');
    setBuildsSpy = jest.spyOn(Actions, 'setBuilds');
  });

  test('fetches builds for the range', async () => {
    await renderLimit();

    expect(setFetchStateSpy).toHaveBeenCalledWith(FetchState.FETCHING);
    expect(fetchSpy).toHaveBeenCalledWith(`${url}/api/builds/time/100...200`);
    expect(setBuildsSpy).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(Build), expect.any(Build), expect.any(Build)])
    );
    expect(setFetchStateSpy).toHaveBeenCalledWith(FetchState.FETCHED);
  });

  test('fetches builds with a custom limit', async () => {
    await renderLimit('300', '400');
    expect(fetchSpy).toHaveBeenCalledWith(`${url}/api/builds/time/300...400`);
  });

  test('sets fetch state error if response fails', async () => {
    fetchSpy.mockImplementation(() => Promise.reject(new Error('some error')));
    await renderLimit();
    expect(setBuildsSpy).not.toHaveBeenCalled();
    expect(setFetchStateSpy).toHaveBeenCalledWith(FetchState.ERROR);
  });

  test('sets fetch state error if response is not an array', async () => {
    fetchSpy.mockImplementation(() => Promise.resolve({ json: (): string => 'tacos' }));
    await renderLimit();
    expect(setBuildsSpy).not.toHaveBeenCalled();
    expect(setFetchStateSpy).toHaveBeenCalledWith(FetchState.ERROR);
  });
});
