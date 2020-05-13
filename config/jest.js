module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  modulePathIgnorePatterns: ['dist', 'lib'],
  resetMocks: true,
  restoreMocks: true,
  testPathIgnorePatterns: ['node_modules'],
  testURL: 'https://build-tracker.local',
  timers: 'fake',
  transform: {
    '^.+\\.[j|t]sx?$': 'babel-jest',
  },
};
