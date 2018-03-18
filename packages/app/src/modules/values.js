// @flow
import type { BT$Artifact } from '@build-tracker/types';

export const Types = {
  CHART: 'chart',
  VALUES: 'valueType',
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
  [ValueType.STAT]: (d: BT$Artifact): number => (d && d.stat) || 0,
  [ValueType.GZIP]: (d: BT$Artifact): number => (d && d.gzip) || 0
};
