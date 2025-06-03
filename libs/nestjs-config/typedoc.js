/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    '../../typedoc.base.js', // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ['./src/index.ts'],
  out: '../../docs/api/nestjs-config',
  publicPath: '/api/nestjs-config',
  name: '@ecoma/nestjs-config',
  entryFileName: 'nestjs-config',
};
