/**
 * Copyright (c) 2019 Paul Armstrong
 */
const chalk = require('chalk');
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');

const SRC_ROOT = path.join(__dirname, '..', 'src');
const DIST_ROOT = path.join(__dirname, '..', 'dist');

const IS_PROD = process.env.NODE_ENV === 'production';

const clearOutput = () => {
  process.stdout.write('\x1B[2J\x1B[0f');
};

const reporter = {
  change: (context, { shortPath }) => {
    clearOutput();
    console.log(`⏱  ${shortPath} changed. Rebuilding…`);
  },

  done: (context, { stats }) => {
    const info = stats.toJson();

    if (stats.hasErrors()) {
      info.errors.forEach(error => {
        console.error(error);
      });
    }
  },

  afterAllDone: context => {
    const { hasErrors, message, name } = context.state;

    if (hasErrors) {
      console.log(`\n 🚨 Server is ready on https://localhost:8080, but may not work correctly\n`);
      console.error(`${chalk.red(name)}: ${message}`);
    } else {
      clearOutput();
      console.log(`\n 🚀 Server is ready on https://localhost:8080\n`);
    }
  }
};

module.exports = {
  entry: {
    app: path.join(SRC_ROOT, 'index.tsx')
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
    path: DIST_ROOT
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(SRC_ROOT, 'index.html'),
      minify: {}
    }),
    !IS_PROD &&
      new WebpackBar({
        reporters: ['fancy', reporter]
      }),
    !IS_PROD && new webpack.HotModuleReplacementPlugin()
  ].filter(Boolean)
};
