/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    "../../../typedoc.base.js", // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ["./src/index.ts"],
  out: "../../../docs/libraries/alm-infrastructure",
  publicPath: "/libraries/alm-infrastructure",
  name: "@ecoma/alm-infrastructure",
  entryFileName: "alm-infrastructure"
};
