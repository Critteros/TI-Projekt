/**
 * This function serves as a mechanism to use node `require` function in bundle
 * Normally when webpuck bundles application it replaces the global require function
 * @param path import path
 * @returns imported require module
 */
export const webpackRequire = (path: string) => {
  const resolver: NodeRequire =
    typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
  return resolver(path);
};
