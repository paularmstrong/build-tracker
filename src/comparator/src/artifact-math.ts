/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { ArtifactSizes } from '@build-tracker/build';

export const delta = (key: string, baseSizes?: ArtifactSizes, prevSizes?: ArtifactSizes): number => {
  if (!baseSizes) {
    if (!prevSizes) {
      return 0;
    }
    return -prevSizes[key];
  } else if (!prevSizes) {
    return baseSizes[key];
  }

  return baseSizes[key] - prevSizes[key];
};

export const percentDelta = (key: string, baseSizes?: ArtifactSizes, prevSizes?: ArtifactSizes): number => {
  if (!baseSizes) {
    if (!prevSizes) {
      return 0;
    }
    return -1;
  }

  if (!prevSizes) {
    return 1;
  }

  const base = prevSizes[key];
  const changed = baseSizes[key];
  if (base === 0) {
    return changed === 0 ? 0 : 1;
  } else if (changed > base) {
    const delta = changed - base;
    return delta / base;
  } else if (changed < base) {
    const delta = base - changed;
    return -(delta / base);
  }
  return 0;
};
