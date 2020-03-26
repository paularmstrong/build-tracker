const withMysql = require('@build-tracker/plugin-with-mysql').default;
const { BudgetLevel, BudgetType } = require('@build-tracker/types');

/**
 * To run a mysql docker container:
 * docker run -p 3306:3306 --name bt-mysql -e MYSQL_ROOT_PASSWORD=tacos -e MYSQL_ROOT_HOST=% -e MYSQL_DATABASE=buildtracker -d mysql --default-authentication-plugin=mysql_native_password
 * yarn ts-node src/server/src/index.ts setup -c ./config/mysql.js
 * yarn ts-node src/server/src/index.ts seed -c ./config/mysql.js
 */

module.exports = withMysql({
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
  mysql: {
    user: 'root',
    password: 'tacos',
    database: 'buildtracker',
    host: '127.0.0.1',
    port: 3306,
  },
  url: 'http://localhost:3000',
});
