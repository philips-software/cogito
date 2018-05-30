const path = require('path')

module.exports = {
  entry: './source/index.js',
  output: {
    library: 'cogitoAttestations',
    libraryTarget: 'umd',
    globalObject: 'this'
  }
}
