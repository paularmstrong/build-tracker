/**
 * Copyright (c) 2019 Paul Armstrong
 */
import ArtifactDelta from '../ArtifactDelta';
import { BudgetLevel, BudgetType } from '@build-tracker/types';

describe('ArtifactDelta', () => {
  describe('name', () => {
    test('returns the given name', () => {
      expect(new ArtifactDelta('tacos', [], {}, {}, false).name).toEqual('tacos');
    });
  });

  describe('sizes', () => {
    test('returns a size object of the deltas', () => {
      const ad = new ArtifactDelta('tacos', [], { gzip: 1, stat: 2 }, { gzip: 3, stat: 4 }, false);
      expect(ad.sizes).toEqual({ gzip: -2, stat: -2 });
    });
  });

  describe('percents', () => {
    test('returns a percent object of the deltas', () => {
      const ad = new ArtifactDelta('tacos', [], { gzip: 2, stat: 2 }, { gzip: 1, stat: 8 }, false);
      expect(ad.percents).toEqual({ gzip: 1, stat: -0.75 });
    });
  });

  describe('hashChanged', () => {
    test('returns whether the hash changed or not', () => {
      expect(new ArtifactDelta('tacos', [], {}, {}, false).hashChanged).toBe(false);
      expect(new ArtifactDelta('tacos', [], {}, {}, true).hashChanged).toBe(true);
    });
  });

  describe('budgets', () => {
    test('returns a list with delta budget', () => {
      const ad = new ArtifactDelta(
        'tacos',
        [{ level: BudgetLevel.ERROR, type: BudgetType.DELTA, sizeKey: 'stat', maximum: 3 }],
        { stat: 7 },
        { stat: 3 },
        false
      );
      expect(ad.budgets).toEqual([
        {
          actual: 4,
          expected: 3,
          level: 'error',
          passing: false,
          sizeKey: 'stat',
          type: 'delta'
        }
      ]);
    });

    test('returns a list with percent delta budget', () => {
      const ad = new ArtifactDelta(
        'tacos',
        [{ level: BudgetLevel.ERROR, type: BudgetType.PERCENT_DELTA, sizeKey: 'stat', maximum: 0.5 }],
        { stat: 4 },
        { stat: 3 },
        false
      );
      expect(ad.budgets).toEqual([
        {
          actual: 1 / 3,
          expected: 0.5,
          level: 'error',
          passing: true,
          sizeKey: 'stat',
          type: 'percentDelta'
        }
      ]);
    });

    test('returns a list with size budget', () => {
      const ad = new ArtifactDelta(
        'tacos',
        [{ level: BudgetLevel.WARN, type: BudgetType.SIZE, sizeKey: 'stat', maximum: 4 }],
        { stat: 5 },
        { stat: 3 },
        false
      );
      expect(ad.budgets).toEqual([
        {
          actual: 5,
          expected: 4,
          level: 'warn',
          passing: false,
          sizeKey: 'stat',
          type: 'size'
        }
      ]);
    });
  });

  describe('failingBudgets', () => {
    test('returns only the failing budgets', () => {
      const ad = new ArtifactDelta(
        'tacos',
        [
          { level: BudgetLevel.ERROR, type: BudgetType.SIZE, sizeKey: 'stat', maximum: 5 },
          { level: BudgetLevel.WARN, type: BudgetType.SIZE, sizeKey: 'stat', maximum: 4 }
        ],
        { stat: 4 },
        { stat: 3 },
        false
      );

      expect(ad.failingBudgets).toEqual([
        {
          actual: 4,
          expected: 4,
          level: 'warn',
          passing: false,
          sizeKey: 'stat',
          type: 'size'
        }
      ]);
    });
  });

  describe('toObject', () => {
    test('returns a simple object', () => {
      const budget = {
        actual: 1 / 3,
        expected: 0.25,
        level: 'error',
        passing: false,
        sizeKey: 'stat',
        type: 'percentDelta'
      };
      const ad = new ArtifactDelta(
        'tacos',
        [{ level: BudgetLevel.ERROR, type: BudgetType.PERCENT_DELTA, sizeKey: 'stat', maximum: 0.25 }],
        { stat: 4 },
        { stat: 3 },
        false
      );
      expect(ad.toObject()).toEqual({
        name: 'tacos',
        sizes: { stat: 1 },
        percents: { stat: 1 / 3 },
        hashChanged: false,
        budgets: [budget],
        failingBudgets: [budget]
      });
    });
  });
});
