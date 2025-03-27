/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    "../../../typedoc.base.js", // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ["./src/index.ts"],
  out: "../../../docs/libraries/alm-application",
  publicPath: "/libraries/alm-application",
  name: "@ecoma/alm-application",
  entryFileName: "alm-application"
};
