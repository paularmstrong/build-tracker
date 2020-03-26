const withPostgres = require('@build-tracker/plugin-with-postgres').default;
const { BudgetLevel, BudgetType } = require('@build-tracker/types');

module.exports = withPostgres({
  artifacts: {
    groups: [
      {
        name: 'Web App',
        artifactMatch: /^app\/client/,
        budgets: [{ level: BudgetLevel.WARN, sizeKey: 'gzip', type: BudgetType.SIZE, maximum: 153600 }],
      },
    ],
  },
  defaultBranch: 'master',
  pg: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
  port: process.env.PORT,
  url: 'https://build-tracker-demo.herokuapp.com',
});
