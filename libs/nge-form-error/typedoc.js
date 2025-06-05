/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    '../../typedoc.base.js', // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ['./src/index.ts'],
  out: '../../docs/api/nge-form-error',
  publicPath: '/api/nge-form-error',
  name: '@ecoma/nge-form-error',
  entryFileName: 'nge-form-error',
};
