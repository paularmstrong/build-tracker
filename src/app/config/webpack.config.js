/**
 * Copyright (c) 2019 Paul Armstrong
 */
const clientConfig = require('./webpack-client.config');
const serverConfig = require('./webpack-server.config');
const createReporter = require('./webpack-progress');

module.exports = (env = {}) => {
  const reporter = env.port && createReporter(env.port);
  return [clientConfig(env, reporter), serverConfig(env, reporter)];
};
