/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    "../../../typedoc.base.js", // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ["./src/index.ts"],
  out: "../../../docs/libraries/common-types",
  publicPath: "/libraries/common-types",
  name: "@ecoma/common-types",
  entryFileName: "common-types",
};
