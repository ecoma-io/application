/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    "../../../typedoc.base.js", // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ["./src/index.ts"],
  out: "../../../docs/libraries/common-testing",
  publicPath: "/libraries/common-testing",
  name: "@ecoma/common-testing",
  entryFileName: "common-testing",
};
