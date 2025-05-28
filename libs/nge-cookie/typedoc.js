/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    "../../typedoc.base.js", // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ["./src/index.ts"],
  out: "../../docs/api/nge-ui",
  publicPath: "/api/nge-cookie",
  name: "@ecoma/nge-cookie",
  entryFileName: "nge-cookie",
};
