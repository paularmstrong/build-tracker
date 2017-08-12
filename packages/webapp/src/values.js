// @flow
import type { BundleStat } from './types';

export const YScaleType = {
  LINEAR: 'linear',
  POW: 'pow'
};

export const XScaleType = {
  TIME: 'time',
  COMMIT: 'commit'
};

export const ValueType = {
  STAT: 'stat',
  GZIP: 'gzip'
};

export const valueTypeAccessor = {
  [ValueType.STAT]: (d: BundleStat): number => (d && d.size) || 0,
  [ValueType.GZIP]: (d: BundleStat): number => (d && d.gzipSize) || 0
};
