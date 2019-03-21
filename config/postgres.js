const withPostgres = require('@build-tracker/plugin-with-postgres').default;

module.exports = withPostgres({
  dev: true,
  pg: {
    connectionString:
      'postgres://licfoidvowmlqn:b447598b2fdc51cda4c456753916ded22edc2e6ba8036fa40ffef1836fa63246@ec2-54-221-243-211.compute-1.amazonaws.com:5432/d379g346in5ekb',
    ssl: true
  },
  url: 'http://localhost:3000'
});
