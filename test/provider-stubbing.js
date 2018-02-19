const td = require('testdouble')
const anything = td.matchers.anything

function stubResponse (provider, request, result) {
  td
    .when(provider.send(request, anything()))
    .thenDo(function (request, callback) {
      callback(null, { jsonrpc: '2.0', id: request.id, result })
    })
}

function stubResponseError (provider, request) {
  td
    .when(provider.send(request, anything()))
    .thenDo(function (request, callback) {
      callback(new Error('an error'), null)
    })
}

module.exports = {
  stubResponse,
  stubResponseError
}
