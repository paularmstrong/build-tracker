module.exports = {
  setupFiles: ['<rootDir>/config/polyfills.js', '<rootDir>/config/jest/browser', '<rootDir>/config/jest/console'],
  snapshotSerializers: ['enzyme-to-json/serializer', 'react-native-web/jest/serializer'],
  rootDir: './',
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost'
};
