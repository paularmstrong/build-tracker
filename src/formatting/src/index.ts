/**
 * Copyright (c) 2019 Paul Armstrong
 */

/**
 * The kibibyte is a multiple of the unit byte for quantities of digital information.
 * KB is 1000 bytes, but we're accustomed to seeing KB as 1024. That unit is actually KiB
 * @type {Number}
 */
const BYTES_IN_KIBIBYTE = 1024;
const KIB_UNIT_STRING = 'KiB';
const defaultByteFormatting = (bytes: number, units: number): number => {
  return Math.round((bytes / units) * 100) / 100;
};

interface FormattingOptions {
  units?: number;
  formatter?: (bytes: number, units: number) => number;
  unitString?: string;
}

export function formatBytes(bytes: number, options: FormattingOptions = {}): string {
  const { units = BYTES_IN_KIBIBYTE, unitString = KIB_UNIT_STRING, formatter = defaultByteFormatting } = options;
  return `${formatter(bytes, units).toLocaleString()} ${unitString}`;
}

export function formatSha(sha: string): string {
  return sha.slice(0, 7);
}
