// @flow
import type { BundleStat } from './types';

export const Types = {
  CHART: 'chart',
  VALUES: 'values',
  XSCALE: 'xscale',
  YSCALE: 'yscale'
};

export const ChartType = {
  AREA: 'area',
  BAR: 'bar'
};

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

export const TypesEnum = {
  [Types.CHART]: ChartType,
  [Types.VALUES]: ValueType,
  [Types.XSCALE]: XScaleType,
  [Types.YSCALE]: YScaleType
};

export const valueTypeAccessor = {
  [ValueType.STAT]: (d: BundleStat): number => (d && d.size) || 0,
  [ValueType.GZIP]: (d: BundleStat): number => (d && d.gzipSize) || 0
};
