import path from 'path';
import express, { RequestHandler } from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { env } from '@/common/settings/env';
import { webpackRequire } from './webpackRequire';

export const clientCompiler = (): RequestHandler[] => {
  if (env.isProduction) {
    return [express.static(path.resolve(process.cwd(), 'build'))];
  }

  if (env.isDevelopment) {
    const webpackConfig = webpackRequire(path.resolve(process.cwd(), 'webpack.config'));
    const compiler = webpack(webpackConfig);

    return [
      webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        serverSideRender: true,
        stats: 'errors-only',
        writeToDisk: true,
      }),
      webpackHotMiddleware(compiler, { log: console.log }),
    ];
  }

  return [];
};
