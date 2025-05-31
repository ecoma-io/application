/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    '../../typedoc.base.js', // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ['./src/index.ts'],
  out: '../../docs/api/nge-redirect',
  publicPath: '/api/nge-redirect',
  name: '@ecoma/nge-redirect',
  entryFileName: 'nge-redirect',
};
