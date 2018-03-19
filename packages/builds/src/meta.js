// @flow
import type { BT$Build, BT$BuildDelta, BT$BuildMetaItem } from '@build-tracker/types';

type AbstractBuild = BT$Build | BT$BuildDelta;

export const getMetaValue = (metaItem: BT$BuildMetaItem) => {
  return typeof metaItem === 'object' ? metaItem.value : metaItem;
};

export const getMetaUrl = (metaItem: BT$BuildMetaItem) => {
  return typeof metaItem === 'object' ? metaItem.url : undefined;
};

export const getValue = (build: AbstractBuild, key: string) => {
  const metaItem = build.meta[key];
  return getMetaValue(metaItem);
};

export const getUrl = (build: AbstractBuild, key: string) => {
  const metaItem = build.meta[key];
  return getMetaUrl(metaItem);
};

export const getRevision = (build: AbstractBuild) => {
  return getValue(build, 'revision');
};

export const getTimestamp = (build: AbstractBuild): number => {
  return build.meta.timestamp;
};

export const getDate = (build: AbstractBuild) => {
  return new Date(getTimestamp(build));
};

export const getBranch = (build: AbstractBuild) => {
  return getValue(build, 'branch');
};
