import querystring from 'querystring';
import { getArtifactsByAvgSize, sortBuilds } from './normalization';

const API_BASE = '/api';

type GetBuildOptions = {
  revisions?: Array<string>
};

const normalizeData = builds => ({
  artifactNames: getArtifactsByAvgSize(builds),
  builds: sortBuilds(builds)
});

export const getBuilds = (opts: GetBuildOptions) => {
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

type GetBranchOptions = {
  count?: number
};
export const getBranches = (opts: GetBranchOptions) => {
  const req = new Request(`${API_BASE}/branches?${querystring.stringify(opts)}`, {
    metod: 'GET'
  });
  return fetch(req).then(res => res.json());
};
