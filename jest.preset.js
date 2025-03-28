const nxPreset = require("@nx/jest/preset").default;
const isCI = require("is-ci");
const rules = require("./rules.js");

module.exports = {
  ...nxPreset,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/index.ts", "!src/**/*.d.ts"],
  coverageReporters: isCI ? ["text", "json-summary", "html"] : ["text", "html"],
  ci: isCI,
  coverageThreshold: {
    global: rules.CODE_COVERAGE,
  },
};
