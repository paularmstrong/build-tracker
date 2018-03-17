// @flow
import type { BT$Build } from '@build-tracker/types';
import querystring from 'querystring';
import { getArtifactsByAvgSize, sortBuilds } from './normalization';

const API_BASE = '/api';

type GetBuildOptions = {
  endTime?: number,
  revisions?: Array<string>,
  startTime?: number
};

const normalizeData = builds => ({
  artifactNames: getArtifactsByAvgSize(builds),
  builds: sortBuilds(builds)
});

export const getBuilds = (
  opts: GetBuildOptions
): Promise<{ artifactNames: Array<string>, builds: Array<BT$Build> }> => {
  if (window.DATA) {
    return Promise.resolve(normalizeData(window.DATA));
  }

  const req = new Request(`${API_BASE}/builds?${querystring.stringify(opts)}`, {
    metod: 'GET'
  });
  return fetch(req)
    .then(res => res.json())
    .then(normalizeData);
};
