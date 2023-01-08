const WebpackBar = require('webpackbar');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const { merge } = require('webpack-merge');

const { baseConfig } = require('./webpack.config.base');
const { viewsDir } = require('./paths');

/**
 * @type {import('webpack').Configuration}
 */
const serverConfigBase = {
  target: 'node',
  entry: {
    server: ['./server/server'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: viewsDir,
          to: './views',
        },
      ],
    }),
  ],
  externals: [nodeExternals()],
  node: {
    __dirname: false,
    __filename: false,
  },
};

/**
 * @type {import('webpack').Configuration}
 */
const serverDevConfig = {
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: '[name].js',
    clean: true,
  },
  plugins: [new WebpackBar({ name: 'server' })],
};

/**
 * @type {import('webpack'.Configuration)}
 */
const serverProdConfig = {
  devtool: 'source-map',
  output: {
    filename: '[name].js',
  },
  optimization: {
    minimize: true,
  },
};

module.exports = {
  serverDev: merge([baseConfig, serverConfigBase, serverDevConfig]),
  serverProd: merge([baseConfig, serverConfigBase, serverProdConfig]),
};
