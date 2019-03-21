const withPostgres = require('@build-tracker/plugin-with-postgres').default;

module.exports = withPostgres({
  pg: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  },
  port: process.env.PORT,
  url: 'https://build-tracker-demo.herokuapp.com'
});
