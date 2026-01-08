import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage (v8 is generally faster)
  coverageProvider: "v8",

  // The test environment that will be used for testing (jsdom simulates a browser in Node.js)
  testEnvironment: "jsdom",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/tests/unit/**/*.+(test|spec).[jt]s?(x)",
    "**/tests/integration/**/*.client.+(test|spec).[jt]s?(x)",
    "**/*.client.+(test|spec).[jt]s?(x)",
  ],

  // A map from regular expressions to paths to transformers (handles TS/JS files via Next.js Babel preset)
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },

  // A map from regular expressions to module names that allow to stub out resources (handles @/ alias)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // A list of paths to modules that run some code to configure the testing framework before each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,ts}",
    "app/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts", // Ignore TypeScript declaration files
    "!**/node_modules/**", // Ignore third-party code
    "!**/*.test.{js,jsx,ts,tsx}", // Ignore test files
    "!**/*.spec.{js,jsx,ts,tsx}", // Ignore spec files
  ],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["html", ["text", { skipFull: true }], "text-summary"],

  // Prevent Jest from ignoring specific node_modules that need to be transformed (common for ESM packages)
  transformIgnorePatterns: [
    "/node_modules/(?!(query-string|decode-uri-component|split-on-first|filter-obj)/)",
  ],
};

export default createJestConfig(config);