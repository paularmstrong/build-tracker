// @flow
import { format } from 'd3-format';
import timeFormat from 'date-fns/format';

const KIB = 1024;
const KIB_UNIT = 'KiB';
const numberFormat = format(',.2f');
type KiBOptions = {|
  units?: string,
  format?: (value: number) => number
|};
export const bytesToKb = (bytes: number, { units, format }: KiBOptions = { units: KIB_UNIT, format: numberFormat }) => {
  const value = bytes / KIB;
  return `${(format || numberFormat)(value)}${units ? ` ${units}` : ''}`;
};

export const formatTime = (d: Date | string | number) => timeFormat(d, 'YYYY-MM-DD HH:mm');
export const formatDate = (d: Date | string | number) => timeFormat(d, 'YYYY-MM-DD');

export const formatSha = (sha: string) => sha.slice(0, 7);
