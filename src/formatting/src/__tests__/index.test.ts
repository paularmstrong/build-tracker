/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { BudgetLevel, BudgetType } from '@build-tracker/types';
import { formatBudgetResult, formatBytes, formatSha } from '../';

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

describe('formatBudgetResult', () => {
  describe('error', () => {
    test('size', () => {
      expect(
        formatBudgetResult(
          {
            sizeKey: 'stat',
            passing: false,
            expected: 2048,
            actual: 4096,
            type: BudgetType.SIZE,
            level: BudgetLevel.ERROR
          },
          'tacos'
        )
      ).toEqual('Error: "tacos" failed budget size limit of 2 KiB by 2 KiB');
    });

    test('delta', () => {
      expect(
        formatBudgetResult(
          {
            sizeKey: 'stat',
            passing: false,
            expected: 2048,
            actual: 4096,
            type: BudgetType.DELTA,
            level: BudgetLevel.ERROR
          },
          'tacos'
        )
      ).toEqual(
        'Error: "tacos" failed budget delta limit. Expected to increase no more than 2 KiB, but increased by 4 KiB'
      );
    });

    test('percentDelta', () => {
      expect(
        formatBudgetResult(
          {
            sizeKey: 'stat',
            passing: false,
            expected: 0.1,
            actual: 0.2,
            type: BudgetType.PERCENT_DELTA,
            level: BudgetLevel.ERROR
          },
          'tacos'
        )
      ).toEqual(
        'Error: "tacos" failed budget percent change limit. Expected no increase by no more than 10.000%, but increased by 20.000%'
      );
    });
  });

  describe('warning', () => {
    test('size', () => {
      expect(
        formatBudgetResult(
          {
            sizeKey: 'stat',
            passing: false,
            expected: 2048,
            actual: 4096,
            type: BudgetType.SIZE,
            level: BudgetLevel.WARN
          },
          'tacos'
        )
      ).toEqual('Warning: "tacos" failed budget size limit of 2 KiB by 2 KiB');
    });

    test('delta', () => {
      expect(
        formatBudgetResult(
          {
            sizeKey: 'stat',
            passing: false,
            expected: 2048,
            actual: 4096,
            type: BudgetType.DELTA,
            level: BudgetLevel.WARN
          },
          'tacos'
        )
      ).toEqual(
        'Warning: "tacos" failed budget delta limit. Expected to increase no more than 2 KiB, but increased by 4 KiB'
      );
    });

    test('percentDelta', () => {
      expect(
        formatBudgetResult(
          {
            sizeKey: 'stat',
            passing: false,
            expected: 0.1,
            actual: 0.2,
            type: BudgetType.PERCENT_DELTA,
            level: BudgetLevel.WARN
          },
          'tacos'
        )
      ).toEqual(
        'Warning: "tacos" failed budget percent change limit. Expected no increase by no more than 10.000%, but increased by 20.000%'
      );
    });
  });
});
