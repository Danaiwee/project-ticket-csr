import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  testMatch: [
    "**/tests/unit/**/*.+(test|spec).[jt]s?(x)",
    "**/tests/integration/**/*.client.+(test|spec).[jt]s?(x)",
    "**/*.client.+(test|spec).[jt]s?(x)",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverageFrom: [
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,ts}",
    "app/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts", // Ignore TypeScript declaration files
    "!**/node_modules/**", // Ignore third-party code
    "!**/*.test.{js,jsx,ts,tsx}", // Ignore test files themselves in coverage
    "!**/*.spec.{js,jsx,ts,tsx}", // Ignore spec files in coverage
  ],
  coverageReporters: ["html", ["text", { skipFull: true }], "text-summary"],
  transformIgnorePatterns: [
    "/node_modules/(?!(query-string|decode-uri-component|split-on-first|filter-obj)/)",
  ],
};

export default createJestConfig(config);
