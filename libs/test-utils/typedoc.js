/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: ['../../typedoc.base.js'],
  entryPoints: ['./src/index.ts'],
  out: '../../docs/api/test-utils',
  publicPath: '/api/test-utils',
  name: '@ecoma/test-utils',
  entryFileName: 'test-utils',
};
