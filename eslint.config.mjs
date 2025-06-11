import nx from "@nx/eslint-plugin";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  {
    files: ["**/*.json"],
    rules: {
      "@nx/dependency-checks": [
        "error",
        {
          ignoredFiles: [
            "{projectRoot}/eslint.config.{js,cjs,mjs}",
            "{projectRoot}/esbuild.config.{js,ts,mjs,mts}",
          ],
        },
      ],
    },
    languageOptions: {
      parser: await import("jsonc-eslint-parser"),
    },
  },
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
    plugins: {
      "unused-imports": unusedImportsPlugin, // Chỉ giữ lại plugin này
    },
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
      // Giữ lại và cấu hình các quy tắc của eslint-plugin-unused-imports
      "no-unused-vars": "off", // Tắt quy tắc gốc
      "@typescript-eslint/no-unused-vars": "off", // Tắt quy tắc TS
      "unused-imports/no-unused-imports": "error", // Phát hiện import không dùng
      "unused-imports/no-unused-vars": [ // Phát hiện biến không dùng
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // Naming convention rules (giữ nguyên nếu bạn muốn, chúng thuộc về @typescript-eslint)
      "@typescript-eslint/naming-convention": [
        "error",
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
          prefix: ["Abstract", "Base"],
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