import { getArtifactsByAvgSize, sortBuilds } from './normalization';

const API_BASE = '/api';

type FetchOptions = {
  limit: number,
  sinceTimestamp: number,
  beforeTimestamp: number,
  sinceRevision: string,
  beforeRevision: string
};

const normalizeData = builds => ({
  artifacts: getArtifactsByAvgSize(builds),
  builds: sortBuilds(builds)
});

export const getBuilds = (opts: FetchOptions) => {
  if (window.DATA) {
    return Promise.resolve(normalizeData(window.DATA));
  }
  const data = new FormData();
  Object.entries(opts).forEach(([k, v]) => {
    data.append(k, v);
  });
  const req = new Request(`${API_BASE}/builds`, {
    // body: data,
    metod: 'GET'
  });
  return fetch(req)
    .then(res => res.json())
    .then(normalizeData);
};
