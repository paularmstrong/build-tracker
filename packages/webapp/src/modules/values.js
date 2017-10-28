// @flow
import type { Artifact } from '../types';

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
  [ValueType.STAT]: (d: Artifact): number => (d && d.size) || 0,
  [ValueType.GZIP]: (d: Artifact): number => (d && d.gzipSize) || 0
};
