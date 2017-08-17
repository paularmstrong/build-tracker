import { mean } from 'd3-array';

export const getAverageSize = (builds, bundle) =>
  mean(builds, commit => (commit.stats[bundle] ? commit.stats[bundle].gzipSize : 0));

export const getBundles = builds =>
  builds
    .reduce((memo, commit) => {
      const bundles = Object.keys(commit.stats);
      return memo.concat(bundles).filter((value, index, self) => self.indexOf(value) === index);
    }, [])
    .sort((a, b) => getAverageSize(builds, b) - getAverageSize(builds, a));
