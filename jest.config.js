/**
 * Jest config.
 * - ts-jest compiles with tsconfig.eslint.json (rootDir ".") because tests/ lives outside
 *   src/, and tsconfig.json's rootDir "src" would reject it.
 * - Test layout and naming: see tests/README.md.
 */
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.eslint.json' }],
  },
  passWithNoTests: true,
};
