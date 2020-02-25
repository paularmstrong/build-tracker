/**
 * Copyright (c) 2019 Paul Armstrong
 */
const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');

const { DIST_ROOT, IS_PROD, SRC_ROOT } = require('./constants');

module.exports = (env, reporter) => ({
  name: 'server',
  target: 'node',
  entry: path.join(SRC_ROOT, 'server/index.tsx'),
  mode: IS_PROD ? 'production' : 'development',
  devServer: {
    contentBase: SRC_ROOT,
    hot: true,
    noInfo: true
  },
  devtool: IS_PROD ? false : 'cheap-module-eval-source-map',
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.(png)$/i,
        loader: 'file-loader',
        options: { outputPath: '../client/static', publicPath: '/client/static', name: '[name].[hash:8].[ext]' }
      }
    ]
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web'
    },
    extensions: ['.tsx', '.ts', '.js']
  },
  node: {
    global: false,
    __dirname: true
  },
  optimization: {
    minimize: false,
    splitChunks: {}
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(DIST_ROOT, 'server')
  },
  plugins: [
    !IS_PROD &&
      reporter &&
      new WebpackBar({
        name: 'Server',
        color: 'blue',
        reporters: ['fancy', reporter]
      }),
    !IS_PROD && new webpack.HotModuleReplacementPlugin()
  ].filter(Boolean)
});
