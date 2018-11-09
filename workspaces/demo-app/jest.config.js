module.exports = {
  setupTestFrameworkScriptFile: require.resolve('./setup-tests.js'),
  snapshotSerializers: [
    'jest-glamor-react'
  ],
  modulePaths: [
    '<rootDir>/src/'
  ]
}
