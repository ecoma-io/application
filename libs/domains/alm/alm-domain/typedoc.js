/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    "../../../typedoc.base.js", // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ["./src/index.ts"],
  out: "../../../docs/libraries/alm-domain",
  publicPath: "/libraries/alm-domain",
  name: "@ecoma/alm-domain",
  entryFileName: "alm-domain"
};
