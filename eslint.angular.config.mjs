import nx from "@nx/eslint-plugin";
import baseConfig from "./eslint.config.mjs";

export default [
  ...baseConfig,
  ...nx.configs["flat/angular"],
  ...nx.configs["flat/angular-template"],
  {
    files: ["**/*.ts"],
    rules: {
      "@angular-eslint/component-class-suffix": "off",
    },
  },
  {
    files: ["**/*.html"],
    // Override or add rules here
    rules: {},
  },
];
