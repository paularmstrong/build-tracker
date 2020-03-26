/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { GraphType } from '../types';
import { searchParamsToStore } from '../utils';

describe('searchParamsToStore', () => {
  test('works with or without leading ?', () => {
    expect(searchParamsToStore('?sizeKey=bar')).toEqual({ sizeKey: 'bar' });
    expect(searchParamsToStore('sizeKey=foo')).toEqual({ sizeKey: 'foo' });
  });

  test('returns empty object for empty string', () => {
    expect(searchParamsToStore('')).toEqual({});
  });

  test('reduces activeArtifacts to an object', () => {
    expect(searchParamsToStore('?activeArtifacts=main&activeArtifacts=vendor&activeArtifacts=shared')).toEqual({
      activeArtifacts: { main: true, vendor: true, shared: true },
    });
  });

  test('converts graphType to enum', () => {
    expect(searchParamsToStore('graphType=STACKED_BAR')).toEqual({ graphType: GraphType.STACKED_BAR });
    expect(searchParamsToStore('graphType=AREA')).toEqual({ graphType: GraphType.AREA });
  });

  test('does not set invalid graphType', () => {
    expect(searchParamsToStore('graphType=tacos')).toEqual({});
  });

  test('converts disabledArtifactsVisible to boolean', () => {
    expect(searchParamsToStore('disabledArtifactsVisible=true')).toEqual({ disabledArtifactsVisible: true });
    expect(searchParamsToStore('disabledArtifactsVisible=false')).toEqual({ disabledArtifactsVisible: false });
  });

  test('sets comparedRevisions to an array', () => {
    expect(searchParamsToStore('comparedRevisions=123&comparedRevisions=abc')).toEqual({
      comparedRevisions: ['123', 'abc'],
    });
  });
});
