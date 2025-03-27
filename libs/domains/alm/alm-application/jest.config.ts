export default {
  displayName: "alm-application",
  preset: "../../../../jest.preset.js",
  setupFiles: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../../../coverage/libs/domains/alm/alm-application",
};
