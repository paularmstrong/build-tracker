// @flow
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
  [ValueType.STAT]: (d: { size: number }): number => d.size || 0,
  [ValueType.GZIP]: (d: { gzipSize: number }): number => d.gzipSize || 0
};
