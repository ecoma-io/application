/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    '../../typedoc.base.js', // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ['./src/index.ts'],
  out: '../../docs/api/iam-service-dtos',
  publicPath: '/api/iam-service-dtos',
  name: '@ecoma/iam-service-dtos',
  entryFileName: 'iam-service-dtos',
};
