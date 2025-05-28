/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    "../../typedoc.base.js", // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ["./src/index.ts"],
  out: "../../docs/api/nge-svg-injector",
  publicPath: "/api/nge-svg-injector",
  name: "@ecoma/nge-svg-injector",
  entryFileName: "nge-svg-injector",
};
