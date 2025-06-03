/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    '../../typedoc.base.js', // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ['./src/index.ts'],
  out: '../../docs/api/nestjs-logger',
  publicPath: '/api/nestjs-logger',
  name: '@ecoma/nestjs-logger',
  entryFileName: 'nestjs-logger',
};
