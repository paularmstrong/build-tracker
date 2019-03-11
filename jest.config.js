module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'plugins/**/*.{ts,tsx}', '!src/app/src/icons/**/*.{ts,tsx}'],
  projects: ['<rootDir>/src/*', '<rootDir>/plugins/*'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testPathIgnorePatterns: ['node_modules'],
  modulePathIgnorePatterns: ['dist', 'lib']
};
