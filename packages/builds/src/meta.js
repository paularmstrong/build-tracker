// @flow
import type { BT$Build, BT$BuildMetaItem } from '@build-tracker/types';

export const getMetaValue = (metaItem: BT$BuildMetaItem) => {
  return typeof metaItem === 'object' ? metaItem.value : metaItem;
};

export const getMetaUrl = (metaItem: BT$BuildMetaItem) => {
  return typeof metaItem === 'object' ? metaItem.url : undefined;
};

export const getValue = (build: BT$Build, key: string) => {
  const metaItem = build.meta[key];
  return getMetaValue(metaItem);
};

export const getUrl = (build: BT$Build, key: string) => {
  const metaItem = build.meta[key];
  return getMetaUrl(metaItem);
};

export const getRevision = (build: BT$Build) => {
  return getValue(build, 'revision');
};

export const getTimestamp = (build: BT$Build): number => {
  return build.meta.timestamp;
};

export const getDate = (build: BT$Build) => {
  return new Date(getTimestamp(build));
};

export const getBranch = (build: BT$Build) => {
  return getValue(build, 'branch');
};
