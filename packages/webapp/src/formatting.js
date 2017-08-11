import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

export const bytesToKb = format(',.4s');

export const formatTime = timeFormat('%Y-%m-%d %H:%M');

export const formatSha = sha => sha.slice(0, 7);
