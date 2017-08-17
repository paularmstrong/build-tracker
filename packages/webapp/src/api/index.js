import { getBundles } from '../stats';

const API_BASE = '/api';

type FetchOptions = {
  limit: number,
  sinceTimestamp: number,
  beforeTimestamp: number,
  sinceRevision: string,
  beforeRevision: string
};

export const getBuilds = (opts: FetchOptions) => {
  const data = new FormData();
  Object.entries(opts).forEach(([k, v]) => {
    data.append(k, v);
  });
  const req = new Request(`${API_BASE}/get.json`, {
    // body: data,
    metod: 'GET'
  });
  return fetch(req).then(res => res.json()).then(builds => ({
    bundles: getBundles(builds),
    builds: builds.sort((a, b) => new Date(b.meta.timestamp) - new Date(a.meta.timestamp))
  }));
};
