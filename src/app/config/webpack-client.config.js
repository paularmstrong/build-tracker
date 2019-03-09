/**
 * Copyright (c) 2019 Paul Armstrong
 */
const path = require('path');
const reporter = require('./webpack-progress');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');

const { DIST_ROOT, IS_PROD, SRC_ROOT } = require('./constants');

module.exports = {
  name: 'client',
  target: 'web',
  entry: {
    app: [
      !IS_PROD && 'webpack-hot-middleware/client?reload=true&noInfo=true',
      path.join(SRC_ROOT, 'client/index.tsx')
    ].filter(Boolean)
  },
  mode: IS_PROD ? 'production' : 'development',
  devServer: {
    contentBase: SRC_ROOT,
    hot: true,
    noInfo: true
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [{ test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ }]
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web'
    },
    extensions: ['.tsx', '.ts', '.js']
  },
  optimization: {
    splitChunks: {
      chunks: 'async'
    }
  },
  output: {
    filename: `[name]${IS_PROD ? '.[hash:8]' : ''}.js`,
    path: path.join(DIST_ROOT, 'client'),
    publicPath: '/client/'
  },
  plugins: [
    !IS_PROD &&
      new WebpackBar({
        name: 'Web',
        color: 'green',
        reporters: ['fancy', reporter]
      }),
    !IS_PROD && new webpack.HotModuleReplacementPlugin()
  ].filter(Boolean)
};
