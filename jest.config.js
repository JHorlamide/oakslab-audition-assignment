/** @type {import('jest').Config} */
const config = {
  verbose: true,
  forceExit: true,
  preset: "ts-jest",
  testEnvironment: "node",
  // testMatch: [""],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};

module.exports = config;
