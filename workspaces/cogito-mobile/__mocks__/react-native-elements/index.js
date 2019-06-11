// Use old-style module.exports instead of new-style 'export', otherwise the
// linter will error on exporting some elements twice.
module.exports = {
  ...require('react-native-elements'),
  ...require('./Button'),
  ...require('./Input')
}
