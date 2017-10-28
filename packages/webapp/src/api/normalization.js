// @flow
import { mean } from 'd3-array';

import type { Build, Artifact } from '../types';

const getAverageSize = (builds: Array<Build>, artifact: Artifact): number =>
  mean(builds, commit => (commit.artifacts[artifact] ? commit.artifacts[artifact].gzipSize : 0));

export const getArtifactsByAvgSize = (builds: Array<Build>): Array<string> =>
  builds
    .reduce((memo, commit) => {
      const artifacts = Object.keys(commit.artifacts);
      return memo.concat(artifacts).filter((value, index, self) => self.indexOf(value) === index);
    }, [])
    .sort((a, b) => getAverageSize(builds, b) - getAverageSize(builds, a));

export const sortBuilds = (builds: Array<Build>): Array<Build> =>
  builds.sort((a, b) => new Date(b.meta.timestamp) - new Date(a.meta.timestamp));
