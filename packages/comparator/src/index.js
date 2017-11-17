// @flow
import type { Artifact, ArtifactDelta, Build, BuildDelta, BuildMeta, ComparisonMatrix } from './types';

const deltaIsBelowThreshold = (originalArtifact: Artifact, updatedArtifact: Artifact, thresholdBytes: number) => {};

export const getAllArtifactNames = (builds: Array<Build>): Array<string> => {
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

const getPercentDelta = (key: 'size' | 'gzipSize', baseArtifact: Artifact, changeArtifact: Artifact): number => {
  if (!changeArtifact) {
    if (!baseArtifact) {
      return 0;
    }
    return 1;
  }

  return !baseArtifact ? 0 : changeArtifact[key] / baseArtifact[key];
};

const getSizeDeltas = (baseArtifact: Artifact, changeArtifact: Artifact): ArtifactDelta => {
  return {
    size: getDelta('size', baseArtifact, changeArtifact),
    sizePercent: getPercentDelta('size', baseArtifact, changeArtifact),
    gzipSize: getDelta('gzipSize', baseArtifact, changeArtifact),
    gzipSizePercent: getPercentDelta('gzipSize', baseArtifact, changeArtifact)
  };
};

export const getBuildDeltas = (builds: Array<Build>): Array<BuildDelta> => {
  const artifactNames = getAllArtifactNames(builds);

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
            [name]: {
              ...getSizeDeltas(compareArtifact, buildArtifact),
              hashChanged: !compareArtifact || !buildArtifact || compareArtifact.hash !== buildArtifact.hash
            }
          };
        }, {});
      })
      .filter(Boolean);

    return {
      meta: build.meta,
      artifactDeltas,
      deltas: []
    };
  });
};

const flatten = (arrays: Array<any>) => arrays.reduce((memo: Array<any>, b: any) => memo.concat(b), []);

export const getBuildComparisonMatrix = (builds: Array<Build>): ComparisonMatrix => {
  const artifactNames = getAllArtifactNames(builds);
  const buildDeltas = getBuildDeltas(builds);
  const buildShas = builds.map(({ meta }) => meta.sha);

  const header = [
    '',
    ...flatten(
      buildDeltas.map(buildDelta => {
        return [
          buildDelta.meta.sha,
          ...buildDelta.artifactDeltas.map((delta, i) => `𝚫 ${buildShas[buildDelta.artifactDeltas.length - 1 - i]}`)
        ];
      })
    )
  ];

  const body = artifactNames.map(artifactName => {
    const deltas = buildDeltas.map(({ artifactDeltas }, i) => [
      builds[i].artifacts[artifactName],
      ...artifactDeltas.map(delta => delta[artifactName])
    ]);
    return [artifactName, ...flatten(deltas)];
  });

  return [header, ...body];
};
