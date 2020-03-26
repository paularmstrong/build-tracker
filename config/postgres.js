const withPostgres = require('@build-tracker/plugin-with-postgres').default;
const { BudgetLevel, BudgetType } = require('@build-tracker/types');

const { config } = require('dotenv');
config();

/**
 * To run a mysql docker container:
 * docker run --name pg -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=buildtracker -p 54320:5432 -d postgres
 * yarn ts-node src/server/src/index.ts setup -c ./config/postgres.js
 * yarn ts-node src/server/src/index.ts seed -c ./config/postgres.js
 */

module.exports = withPostgres({
  defaultBranch: 'master',
  dev: true,
  artifacts: {
    groups: [
      {
        name: 'Web App',
        artifactMatch: /^app\/client/,
        budgets: [{ level: BudgetLevel.ERROR, sizeKey: 'gzip', type: BudgetType.SIZE, maximum: 150000 }],
      },
    ],
  },
  pg: {
    connectionString: 'postgresql://postgres:mysecretpassword@127.0.0.1:54320/buildtracker',
    ssl: false,
  },
  url: 'http://localhost:3000',
});
