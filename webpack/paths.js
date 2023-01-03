const glob = require('glob');
const path = require('path');
const { resolve } = require('path');

// Project directory
const rootDir = resolve(__dirname, '..');

// Project source code
const srcDir = resolve(rootDir, 'src');

// Project dirs
const commonDir = resolve(srcDir, 'common');
const clientDir = resolve(srcDir, 'client');
const serverDir = resolve(srcDir, 'server');
const viewsDir = resolve(serverDir, 'views');

// Project definition files
const tsConfig = resolve(rootDir, 'tsconfig.json');
const nodeModules = resolve(rootDir, 'node_modules');
const buildDir = resolve(rootDir, 'build');
const jsBundleDir = resolve(buildDir, 'bundle');

// Client bundles
const clientBundleDir = resolve(clientDir, 'target');
const clientBundles = Object.fromEntries(
  glob.sync(`${clientBundleDir}/**.ts`).map((el) => [path.parse(el).name, [el]]),
);

module.exports = {
  rootDir,
  srcDir,
  commonDir,
  clientDir,
  serverDir,
  tsConfig,
  nodeModules,
  buildDir,
  viewsDir,
  clientBundles,
  jsBundleDir,
};
