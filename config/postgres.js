const withPostgres = require('@build-tracker/plugin-with-postgres').default;

module.exports = withPostgres({
  dev: true,
  pg: {
    ssl: true
  }
});
