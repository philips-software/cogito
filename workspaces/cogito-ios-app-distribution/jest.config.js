module.exports = {
  setupTestFrameworkScriptFile: require.resolve('./setup-tests.js'),
  snapshotSerializers: [
    'jest-glamor-react'
  ],
  setupFiles: [
    'jest-canvas-mock'
  ],
  modulePaths: [
    '<rootDir>/src/'
  ],
  moduleNameMapper: {
    '\\.(png|gif|jpg)$': '<rootDir>/__mocks__/fileMock.js'
  }
}
