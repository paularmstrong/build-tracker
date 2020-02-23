const makeFixtureConfig = require('./fixtures-base');
const { BudgetLevel, BudgetType } = require('@build-tracker/types');

module.exports = makeFixtureConfig('large', {
  artifacts: {
    budgets: {
      '*': [{ level: BudgetLevel.WARN, sizeKey: 'gzip', type: BudgetType.PERCENT_DELTA, maximum: 0.5 }]
    },
    groups: [{ artifactMatch: /^web\//, name: 'Web' }, { artifactMatch: /^serviceworker\//, name: 'Service Worker' }],
    filters: [
      // Ignore all but english
      /web\/i18n-\w+\/(?!en\.).+/,
      // Ignore all but english
      /web\/ondemand\.emoji\.(?!en\.).+/,
      /web\/ondemand\.countries-(?!en\.).+/
    ]
  },
  budgets: [{ level: BudgetLevel.WARN, sizeKey: 'gzip', type: BudgetType.DELTA, maximum: 1000 }],
  defaultSizeKey: 'gzip',
  name: 'Static Fixtures - Large Set'
});
