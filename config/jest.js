module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  modulePathIgnorePatterns: ['dist', 'lib'],
  resetMocks: true,
  restoreMocks: true,
  testPathIgnorePatterns: ['node_modules'],
  testURL: 'https://build-tracker.local',
  timers: 'fake',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  }
};
