const td = require('testdouble')
const anything = td.matchers.anything

function stubResponse (provider, request, result) {
  td
    .when(provider.send(request, anything()))
    .thenDo(function (request, callback) {
      callback(null, { jsonrpc: '2.0', id: request.id, result })
    })
}

function stubResponseReject (provider, request) {
  td
    .when(provider.send(request, anything()))
    .thenDo(function (request, callback) {
      callback(new Error('an error'), null)
    })
}

function stubResponseError (provider, request, error) {
  td
    .when(provider.send(request, anything()))
    .thenDo(function (request, callback) {
      callback(null, { jsonrpc: '2.0', id: request.id, error })
    })
}

module.exports = {
  stubResponse,
  stubResponseReject,
  stubResponseError
}
