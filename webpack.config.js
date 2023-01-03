const { isDevelopment, isClient, isServer } = require('./webpack/webpack.config.base');
const { serverDev, serverProd } = require('./webpack/webpack.config.server');
const { clientDev, clientProd } = require('./webpack/webpack.config.client');

let target = {};

if (isServer) {
  if (isDevelopment) {
    target = serverDev;
  } else {
    target = serverProd;
  }
}

if (isClient) {
  if (isDevelopment) {
    target = clientDev;
  } else {
    target = clientProd;
  }
}

module.exports = target;
