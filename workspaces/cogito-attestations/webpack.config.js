const path = require('path')

module.exports = function (env = {}) {
  const { production } = env
  return {
    mode: production ? 'production' : 'development',
    devtool: 'source-maps',
    entry: './source/index.js',
    output: {
      path: path.join(__dirname, 'umd'),
      filename: `cogito-attestations.${production ? 'min.js' : 'js'}`,
      library: 'cogitoAttestations',
      libraryTarget: 'umd',
      globalObject: 'this'
    }
  }
}
