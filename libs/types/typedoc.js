/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  extends: [
    "../../typedoc.base.js",
  ],
  entryPoints: ["./src/index.ts"],
  out: "../../docs/api/types",
  publicPath: "/api/types",
  name: "@ecoma/types",
  entryFileName: "types",
};
