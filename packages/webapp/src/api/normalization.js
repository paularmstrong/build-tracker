// @flow
import { mean } from 'd3-array';

const getAverageSize = (builds: Array<Build>, artifact: string): number =>
  mean(builds, commit => (commit.artifacts[artifact] ? commit.artifacts[artifact].gzip : 0));

export const getArtifactsByAvgSize = (builds: Array<Build>): Array<string> =>
  builds
    .reduce((memo, commit): Array<string> => {
      const artifactNAmes = Object.keys(commit.artifacts);
      return memo.concat(artifactNAmes).filter((value, index, self) => self.indexOf(value) === index);
    }, [])
    .sort((a: string, b: string) => getAverageSize(builds, b) - getAverageSize(builds, a));

export const sortBuilds = (builds: Array<Build>): Array<Build> =>
  builds.sort((a, b) => new Date(b.meta.timestamp) - new Date(a.meta.timestamp));
