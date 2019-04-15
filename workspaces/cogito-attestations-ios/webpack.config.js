const path = require('path')

module.exports = function (env = {}) {
  return {
    mode: 'production',
    devtool: 'source-maps',
    entry: './index.js',
    output: {
      path: path.join(__dirname, 'umd'),
      filename: 'cogito-attestations.min.js',
      library: 'cogitoAttestations',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    stats: 'errors-only'
  }
}
