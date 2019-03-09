/**
 * Copyright (c) 2019 Paul Armstrong
 */
const clientConfig = require('./webpack-client.config');
const serverConfig = require('./webpack-server.config');
const createReporter = require('./webpack-progress');

module.exports = ({ port = 3000 } = {}) => {
  const reporter = port && createReporter(port);
  return [clientConfig(reporter), serverConfig(reporter)];
};
