// @flow
import type { Artifact, ArtifactDelta, Build, BuildDelta, BuildMeta } from './types';

const deltaIsBelowThreshold = (originalArtifact: Artifact, updatedArtifact: Artifact, thresholdBytes: number) => {};

export const getAllArtifactNames = (...builds: Array<Build>): Array<string> => {
  return Array.prototype.concat
    .apply([], builds.map(({ artifacts }) => Object.keys(artifacts)))
    .filter((value, index, self) => self.indexOf(value) === index);
};

const getDelta = (key: 'size' | 'gzipSize', baseArtifact: Artifact, changeArtifact: Artifact): number => {
  if (!changeArtifact) {
    if (!baseArtifact) {
      return 0;
    }
    return -baseArtifact[key];
  }

  return changeArtifact[key] - (baseArtifact ? baseArtifact[key] : 0);
};

const getSizeDeltas = (baseArtifact: Artifact, changeArtifact: Artifact): ArtifactDelta => {
  return {
    size: getDelta('size', baseArtifact, changeArtifact),
    gzipSize: getDelta('gzipSize', baseArtifact, changeArtifact)
  };
};

export const getBuildDeltas = (...builds: Array<Build>): Array<BuildDelta> => {
  const artifactNames = getAllArtifactNames(...builds);

  return builds.map((build, i) => {
    const artifactDeltas = builds
      .map((compareBuild, j) => {
        if (j >= i) {
          return null;
        }

        return artifactNames.reduce((deltas, name) => {
          const buildArtifact = build.artifacts[name];
          const compareArtifact = compareBuild.artifacts[name];
          return {
            ...deltas,
            [name]: getSizeDeltas(compareArtifact, buildArtifact)
          };
        }, {});
      })
      .filter(Boolean);

    return {
      ...build,
      artifactDeltas,
      deltas: []
    };
  });
};
