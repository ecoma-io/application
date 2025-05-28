/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    "../../typedoc.base.js", // Điều chỉnh đường dẫn này nếu file preset ở vị trí khác
  ],
  entryPoints: ["./src/index.ts"],
  out: "../../docs/api/nx-typedoc",
  publicPath: "/api/nx-typedoc",
  name: "@ecoma/nx-typedoc",
  entryFileName: "nx-typedoc",
};
