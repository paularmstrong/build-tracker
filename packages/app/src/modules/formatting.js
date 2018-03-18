// @flow
import { format } from 'd3-format';
import timeFormat from 'date-fns/format';

const KIB = 1024;
const KIB_UNIT = 'KiB';
const numberFormat = format(',.2f');
export const bytesToKb = (bytes: number, units: string = KIB_UNIT) => {
  const value = bytes / KIB;
  return `${numberFormat(value)}${units ? ` ${units}` : ''}`;
};

export const formatTime = (d: Date | string | number) => timeFormat(d, 'YYYY-MM-DD HH:mm');
export const formatDate = (d: Date | string | number) => timeFormat(d, 'YYYY-MM-DD');

export const formatSha = (sha: string) => sha.slice(0, 7);
