/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    "../../../typedoc.base.js", // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ["./src/index.ts"],
  out: "../../../docs/libraries/common-application",
  publicPath: "/libraries/common-application",
  name: "@ecoma/common-application",
  entryFileName: "common-application",
};
