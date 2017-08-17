// @flow
import { mean } from 'd3-array';

import type { Build, Bundle } from '../types';

const getAverageSize = (builds: Array<Build>, bundle: Bundle): number =>
  mean(builds, commit => (commit.stats[bundle] ? commit.stats[bundle].gzipSize : 0));

export const getBundlesByAvgSize = (builds: Array<Build>): Array<string> =>
  builds
    .reduce((memo, commit) => {
      const bundles = Object.keys(commit.stats);
      return memo.concat(bundles).filter((value, index, self) => self.indexOf(value) === index);
    }, [])
    .sort((a, b) => getAverageSize(builds, b) - getAverageSize(builds, a));

export const sortBuilds = (builds: Array<Build>): Array<Build> =>
  builds.sort((a, b) => new Date(b.meta.timestamp) - new Date(a.meta.timestamp));
