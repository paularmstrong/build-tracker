import querystring from 'querystring';
import { getArtifactsByAvgSize, sortBuilds } from './normalization';

const API_BASE = '/api';

type FetchOptions = {
  revisions: Array<string>
};

const normalizeData = builds => ({
  artifacts: getArtifactsByAvgSize(builds),
  builds: sortBuilds(builds)
});

export const getBuilds = (opts: FetchOptions) => {
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
