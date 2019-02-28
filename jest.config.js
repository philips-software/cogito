module.exports = {
  projects: [
    'workspaces/cogito-attestations',
    'workspaces/cogito-encryption',
    'workspaces/cogito-ethereum-react',
    'workspaces/cogito-ethereum',
    'workspaces/cogito-identity',
    'workspaces/cogito-ios-app-distribution',
    'workspaces/cogito-react-ui',
    'workspaces/cogito-web3-provider',
    'workspaces/crypto',
    'workspaces/demo-app',
    'workspaces/faucet',
    'workspaces/telepath-js',
    'workspaces/telepath-queuing-service'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'source/**.js',
    'src/**.js',
    '!**/jest.config.js',
    '!**/babel.config.js',
    '!**/webpack.config.js',
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
