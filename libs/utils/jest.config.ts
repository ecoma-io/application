export default {
  displayName: 'utils',
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageReporters: ["html", "text"],
  coverageDirectory: "../../dist/coverage/libs/utils",
};
