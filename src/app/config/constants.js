/**
 * Copyright (c) 2019 Paul Armstrong
 */
const path = require('path');

module.exports = {
  SRC_ROOT: path.join(__dirname, '..', 'src'),
  DIST_ROOT: path.join(__dirname, '..', 'dist'),
  IS_PROD: process.env.NODE_ENV === 'production'
};
