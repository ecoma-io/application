/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    "../../../typedoc.base.js", // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryFileName: "common-domain",
  entryPoints: ["./src/index.ts"],
  out: "../../../docs/libraries/common-domain",
  publicPath: "/libraries/common-domain",
  name: "@ecoma/common-domain",
};
