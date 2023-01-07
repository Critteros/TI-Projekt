const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const { baseConfig } = require('./webpack.config.base');
const paths = require('./paths');

/**
 * @type {import('webpack').Configuration}
 */
const clientConfigBase = {
  target: 'web',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    path: paths.jsBundleDir,
    publicPath: '/bundle',
  },
  entry: {
    ...paths.clientBundles,
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false,
      net: false,
      tls: false,
      dgram: false,
      child_process: false,
    },
  },
  optimization: {
    runtimeChunk: 'single',
  },
};

/**
 * @type {import('webpack').Configuration}
 */
const clientDevConfig = {
  devtool: 'eval-cheap-module-source-map',
  entry: {
    hmr: ['webpack-hot-middleware/client?reload=true'],
  },
  devServer: {
    hot: true,
    open: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WebpackBar({ name: 'client', color: 'orange' }),
  ],
};

/**
 * @type {import('webpack').Configuration}
 */
const clientConfigProd = {
  devtool: 'source-map',
  optimization: {
    minimize: true,
  },
};

module.exports = {
  clientDev: merge([baseConfig, clientConfigBase, clientDevConfig]),
  clientProd: merge([baseConfig, clientConfigBase, clientConfigProd]),
};
