const nxPreset = require("@nx/jest/preset").default;
const isCI = require("is-ci");

module.exports = {
  ...nxPreset,
  ci: isCI,
  passWithNoTests: true,
};
