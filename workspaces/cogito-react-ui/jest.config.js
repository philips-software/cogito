module.exports = {
  setupFiles: [
    'jest-canvas-mock'
  ],
  setupTestFrameworkScriptFile: require.resolve('./setup-tests.js'),
  modulePaths: [
    '<rootDir>/../demo-app/src/'
  ]
}
