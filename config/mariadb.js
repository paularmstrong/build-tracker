const withMaria = require('@build-tracker/plugin-with-mariadb').default;
const { BudgetLevel, BudgetType } = require('@build-tracker/types');

/**
 * To run a mariadb docker container:
 * docker run -p 3307:3306 --name bt-mariadb -e MYSQL_ROOT_PASSWORD=tacos -e MYSQL_ROOT_HOST=% -e MYSQL_DATABASE=buildtracker -d mariadb --default-authentication-plugin=mysql_native_password
 * yarn ts-node src/server/src/index.ts setup -c ./config/mariadb.js
 * yarn ts-node src/server/src/index.ts seed -c ./config/mariadb.js
 */

module.exports = withMaria({
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
  mariadb: {
    user: 'root',
    password: 'tacos',
    database: 'buildtracker',
    host: '127.0.0.1',
    port: 3307,
  },
  url: 'http://localhost:3000',
});
