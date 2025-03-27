import jsoncParser from "jsonc-eslint-parser";
import baseConfig from "../../eslint.config.mjs";

export default [
  ...baseConfig,
  {
    files: ["**/*.json"],
    rules: {
      "@nx/dependency-checks": [
        "error",
        {
          ignoredFiles: ["{projectRoot}/eslint.config.{js,cjs,mjs}"],
        },
      ],
    },
    languageOptions: {
      parser: jsoncParser,
    },
  },
  {
    files: [
      "**/package.json",
      "**/generators.json",
      "**/package.json",
      "**/generators.json",
    ],
    rules: { "@nx/nx-plugin-checks": "error" },
    languageOptions: {
      parser: jsoncParser,
    },
  },
];
