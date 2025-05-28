/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    "../../typedoc.base.js",
  ],
  entryPoints: ["./src/index.ts"],
  out: "../../docs/api/utils",
  publicPath: "/api/utils",
  name: "@ecoma/utils",
  entryFileName: "utils",
};
