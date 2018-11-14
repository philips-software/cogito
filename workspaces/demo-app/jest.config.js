module.exports = {
  setupFiles: [
    'jest-canvas-mock'
  ],
  setupTestFrameworkScriptFile: require.resolve('./setup-tests.js'),
  snapshotSerializers: [
    'jest-glamor-react'
  ],
  modulePaths: [
    '<rootDir>/src/'
  ]
}
