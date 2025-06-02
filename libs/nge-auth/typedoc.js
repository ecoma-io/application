/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    '../../typedoc.base.js', // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ['./src/index.ts'],
  out: '../../docs/api/nge-auth',
  publicPath: '/api/nge-auth',
  name: '@ecoma/nge-auth',
  entryFileName: 'nge-auth',
};
