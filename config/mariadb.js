const withMaria = require('@build-tracker/plugin-with-mariadb').default;
const { BudgetLevel, BudgetType } = require('@build-tracker/types');

module.exports = withMaria({
  defaultBranch: 'master',
  dev: true,
  artifacts: {
    groups: [
      {
        name: 'Web App',
        artifactMatch: /^app\/client/,
        budgets: [{ level: BudgetLevel.ERROR, sizeKey: 'gzip', type: BudgetType.SIZE, maximum: 150000 }]
      }
    ]
  },
  mariadb: {
    user: 'root',
    password: 'tacos',
    database: 'buildtracker',
    host: '127.0.0.1',
    port: 3306
  },
  url: 'http://localhost:3000'
});
