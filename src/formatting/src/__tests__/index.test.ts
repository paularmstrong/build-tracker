import { formatBytes, formatSha } from '../';

describe('formatBytes', () => {
  describe('defaults', () => {
    test('converts raw bytes to kibibytes', () => {
      expect(formatBytes(1024)).toBe('1 KiB');
      expect(formatBytes(2048)).toBe('2 KiB');
      expect(formatBytes(2560)).toBe('2.5 KiB');
    });

    test('rounds to 2 decimal places', () => {
      expect(formatBytes(1000)).toBe('0.98 KiB');
    });

    test('uses locale formatting to add appropriate long-number formatting', () => {
      expect(formatBytes(1024000)).toBe('1,000 KiB');
      expect(formatBytes(1025000)).toBe('1,000.98 KiB');
    });
  });

  describe('units', () => {
    test('allows custom dividend', () => {
      expect(formatBytes(1024, { units: 1000 })).toEqual('1.02 KiB');
    });

    test('allows custom unit string', () => {
      expect(formatBytes(1024, { units: 1000, unitString: 'KB' })).toEqual('1.02 KB');
    });

    test('allows custom formatting function', () => {
      const formatter = (bytes: number, units: number): number => Math.round(bytes / units);
      expect(formatBytes(1024, { formatter })).toEqual('1 KiB');
    });
  });
});

describe('formatSha', () => {
  test('slices the sha to 7 characters', () => {
    expect(formatSha('1234567abcdef')).toEqual('1234567');
  });
});
