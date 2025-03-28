const nxPreset = require("@nx/jest/preset").default;
const isCI = require("is-ci");
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.base.json");

module.exports = {
  ...nxPreset,
  ci: isCI,
  passWithNoTests: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: __dirname,
  }),
};
