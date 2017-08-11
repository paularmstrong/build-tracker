import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

const KIB = 1024;
const KIB_UNIT = 'KiB';
const numberFormat = format(',.2f');
export const bytesToKb = (bytes, units = KIB_UNIT) => {
  const value = bytes / KIB;
  return `${numberFormat(value)}${units ? ` ${units}` : ''}`;
};

export const formatTime = timeFormat('%Y-%m-%d %H:%M');

export const formatSha = sha => sha.slice(0, 7);
