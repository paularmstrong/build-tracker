const withPostgres = require('@build-tracker/plugin-with-postgres').default;
const { BudgetLevel, BudgetType } = require('@build-tracker/types');

module.exports = withPostgres({
  artifacts: {
    groups: [
      {
        name: 'Web App',
        artifactNames: ['app/client/vendor', 'app/client/app', 'app/client/Comparison'],
        budgets: [{ level: BudgetLevel.ERROR, sizeKey: 'gzip', type: BudgetType.SIZE, maximum: 150000 }]
      }
    ]
  },
  pg: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  },
  port: process.env.PORT,
  url: 'https://build-tracker-demo.herokuapp.com'
});
