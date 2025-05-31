/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    '../../typedoc.base.js', // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ['./src/index.ts'],
  out: '../../docs/api/nge-domain',
  publicPath: '/api/nge-domain',
  name: '@ecoma/nge-domain',
  entryFileName: 'nge-domain',
};
