/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: ['../../typedoc.base.js'],
  entryPoints: ['./src/index.ts'],
  out: '../../docs/api/common',
  publicPath: '/api/common',
  name: '@ecoma/common',
  entryFileName: 'common',
};
