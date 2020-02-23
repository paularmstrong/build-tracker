const makeFixtureConfig = require('./fixtures-base');
const { BudgetLevel, BudgetType } = require('@build-tracker/types');

module.exports = makeFixtureConfig('medium', {
  artifacts: {
    groups: [
      {
        name: 'Entries',
        artifactMatch: /^\w+$/,
        budgets: [{ level: BudgetLevel.ERROR, sizeKey: 'gzip', type: BudgetType.SIZE, maximum: 250000 }]
      },
      {
        name: 'Home',
        artifactNames: ['main', 'vendor', 'shared', 'runtime', 'bundle.HomeTimeline'],
        budgets: [{ level: BudgetLevel.ERROR, sizeKey: 'gzip', type: BudgetType.SIZE, maximum: 350000 }]
      }
    ]
  },
  defaultSizeKey: 'gzip',
  name: 'Static Fixtures'
});
