/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { BudgetLevel, BudgetResult, BudgetType } from '@build-tracker/types';
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

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(3)}%`;
}

const levelToString = {
  [BudgetLevel.WARN]: 'Warning',
  [BudgetLevel.ERROR]: 'Error'
};

export function formatBudgetResult(budgetResult: BudgetResult, itemName: string): string {
  const { actual, expected, level, type } = budgetResult;
  const actualFormatted = type === BudgetType.PERCENT_DELTA ? formatPercent(actual) : formatBytes(actual);
  const expectedFormatted = type === BudgetType.PERCENT_DELTA ? formatPercent(expected) : formatBytes(expected);
  const diffFormatted =
    type === BudgetType.PERCENT_DELTA ? formatPercent(actual - expected) : formatBytes(actual - expected);

  const prefix = `${levelToString[level]}: "${itemName}"`;

  switch (type) {
    case BudgetType.DELTA:
      return `${prefix} failed budget delta limit. Expected to increase no more than ${expectedFormatted}, but increased by ${actualFormatted}`;
    case BudgetType.PERCENT_DELTA:
      return `${prefix} failed budget percent change limit. Expected no increase by no more than ${expectedFormatted}, but increased by ${actualFormatted}`;
    case BudgetType.SIZE:
      return `${prefix} failed budget size limit of ${expectedFormatted} by ${diffFormatted}`;
  }
}
