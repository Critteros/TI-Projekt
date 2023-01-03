const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const paths = require('./paths');

const mode = process.env.NODE_ENV || 'development';
const isDevelopment = mode === 'development';
const isProduction = mode === 'production';
const target = process.env.TARGET || 'client';
const isClient = target === 'client';
const isServer = target === 'server';
const publicPath = '/';

/**
 * @type {import('webpack').Configuration}
 */
const baseConfig = {
  mode,
  context: paths.srcDir,
  output: {
    publicPath,
    path: paths.buildDir,
  },
  resolve: {
    mainFields: ['module', 'browser', 'main'],
    extensions: ['.ts', '.js', '.json'],
    plugins: [new TsconfigPathsPlugin({ configFile: paths.tsConfig })],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        loader: 'file-loader',
        exclude: [/\.m?([jt])sx?$/, /\.json$/, /\.s?css$/],
        options: {
          emitFile: isClient,
          name: 'assets/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: { configFile: paths.tsConfig },
    }),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      cwd: process.cwd(),
    }),
  ],
  stats: {
    colors: true,
    modules: false,
    children: false,
  },
  performance: {
    hints: false,
  },
  optimization: {
    noEmitOnErrors: false,
  },
};

module.exports = {
  baseConfig,
  isDevelopment,
  isProduction,
  target,
  isClient,
  isServer,
  publicPath,
};
