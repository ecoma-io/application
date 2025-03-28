import nx from "@nx/eslint-plugin";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  {
    ignores: ["**/dist"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "no-console": "error",
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: ["^.*/eslint(\\.base)?\\.config\\.[cm]?js$"],
          depConstraints: [
            {
              sourceTag: "*",
              onlyDependOnLibsWithTags: ["*"],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.cts",
      "**/*.mts",
      "**/*.js",
      "**/*.jsx",
      "**/*.cjs",
      "**/*.mjs",
    ],
    // Override or add rules here
    rules: {},
  },
  {
    files: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.test.cts",
      "**/*.test.mts",
      "**/*.test.js",
      "**/*.test.jsx",
      "**/*.test.cjs",
      "**/*.test.mjs",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/*.spec.cts",
      "**/*.spec.mts",
      "**/*.spec.js",
      "**/*.spec.jsx",
      "**/*.spec.cjs",
      "**/*.spec.mjs",
    ],
    // Override or add rules here
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
