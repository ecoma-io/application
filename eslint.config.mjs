import nx from "@nx/eslint-plugin";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  {
    ignores: [
      "**/dist",
      "**/node_modules",
      "**/eslint.config.mjs",
      "**/jest.config.ts",
      "**/typedoc.js",
      "**/commitlint.config.js",
    ],
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
    rules: {
      // Naming convention rules
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "forbid",
          trailingUnderscore: "forbid",
        },
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        {
          selector: "variable",
          modifiers: ["const", "exported"],
          format: ["UPPER_CASE", "camelCase", "PascalCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "variable",
          modifiers: ["const"],
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "property",
          format: ["camelCase", "snake_case"],
          leadingUnderscore: "allow",
        },
        {
          selector: "classProperty",
          format: ["camelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "classProperty",
          modifiers: ["private", "protected"],
          format: ["camelCase"],
          leadingUnderscore: "require",
        },
        {
          selector: "classProperty",
          modifiers: ["public"],
          format: ["camelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "classProperty",
          modifiers: ["readonly"],
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "classMethod",
          format: ["camelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "classMethod",
          modifiers: ["private", "protected"],
          format: ["camelCase"],
          leadingUnderscore: "require",
        },
        {
          selector: "classMethod",
          modifiers: ["public"],
          format: ["camelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "classMethod",
          modifiers: ["abstract"],
          format: ["camelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "accessor",
          format: ["camelCase"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "class",
          format: ["PascalCase"],
        },
        {
          selector: "class",
          modifiers: ["abstract"],
          format: ["PascalCase"],
          prefix: ["Abstract"],
        },
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
        {
          selector: "enum",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["PascalCase", "UPPER_CASE"],
        },
        {
          selector: "typeParameter",
          format: ["PascalCase"],
          prefix: ["T"],
        },
        {
          selector: "variable",
          filter: {
            regex: "^__",
            match: true,
          },
          format: null,
        },
      ],
    },
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
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
