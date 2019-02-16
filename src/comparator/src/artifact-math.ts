import { ArtifactSizes } from '@build-tracker/build';

export const delta = (key: string, baseArtifact?: ArtifactSizes, prevArtifact?: ArtifactSizes): number => {
  if (!baseArtifact) {
    if (!prevArtifact) {
      return 0;
    }
    return -prevArtifact[key];
  } else if (!prevArtifact) {
    return baseArtifact[key];
  }

  return baseArtifact[key] - prevArtifact[key];
};

export const percentDelta = (key: string, baseArtifact?: ArtifactSizes, prevArtifact?: ArtifactSizes): number => {
  if (!baseArtifact) {
    if (!prevArtifact) {
      return 0;
    }
    return -1;
  }

  if (!prevArtifact) {
    return 1;
  }

  const base = prevArtifact[key];
  const changed = baseArtifact[key];
  if (changed > base) {
    const delta = changed - base;
    return delta / base;
  } else if (changed < base) {
    const delta = base - changed;
    return -(delta / base);
  }
  return 0;
};
