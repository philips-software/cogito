module.exports = {
  projects: [
    'workspaces/cogito-web3',
    'workspaces/cogito-encryption',
    'workspaces/cogito-identity',
    'workspaces/cogito-attestations',
    'workspaces/telepath-js',
    'workspaces/telepath-queuing-service',
    'workspaces/demo-app',
    'workspaces/crypto',
    'workspaces/faucet',
    'workspaces/cogito-ios-app-distribution'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'source/**.js',
    'src/**.js',
    '!**/jest.config.js',
    '!**/babel.config.js',
    '!**/rollup.config.js',
    '!**/.babelrc.js',
    '!**/*.test.js',
    '!**/__mocks__/**.js',
    '!**/test-helpers/**.js',
    '!**/tools/**.js',
    '!**/node_modules/**'
  ],
  coverageReporters: [
    'text-summary',
    'lcov'
  ]
}
