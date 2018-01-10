/* eslint-env mocha */
const JsonRpcChannel = require('../lib/json-rpc-channel')
const expect = require('chai').expect
const td = require('testdouble')

describe('JSON RPC Channel', function () {
  const request = { jsonrpc: '2.0', id: 1, method: 'foo' }
  const response = { jsonrpc: '2.0', id: 1, result: 'bar' }

  let jsonrpc
  let channel

  beforeEach(function () {
    channel = td.object()
    jsonrpc = new JsonRpcChannel({ channel: channel })
  })

  context('when a valid response is available', function () {
    beforeEach(function () {
      td.when(channel.send(JSON.stringify(request))).thenDo(() => {
        td.when(channel.receive()).thenResolve(JSON.stringify(response))
      })
    })

    it('returns the response that is received', async function () {
      expect(await jsonrpc.send(request)).to.eql(response)
    })

    it('throws when request is not a json rpc 2.0 request', async function () {
      const wrongRequest = { jsonrpc: '0.42', id: 1, method: 'test' }
      await expect(jsonrpc.send(wrongRequest)).to.be.rejected()
    })

    it('throws when request does not have an id', async function () {
      const wrongRequest = { jsonrpc: '2.0', method: 'test' }
      await expect(jsonrpc.send(wrongRequest)).to.be.rejected()
    })

    it('throws when request does not specify a method', async function () {
      const wrongRequest = { jsonrpc: '2.0', id: 1 }
      await expect(jsonrpc.send(wrongRequest)).to.be.rejected()
    })
  })

  it('ignores responses that are not json', async function () {
    td.when(channel.receive()).thenResolve(
      'invalid json',
      JSON.stringify(response)
    )
    expect(await jsonrpc.send(request)).to.eql(response)
  })

  it('ignores responses with the wrong id', async function () {
    td.when(channel.receive()).thenResolve(
      JSON.stringify({ jsonrpc: '2.0', id: 0, result: null }),
      JSON.stringify(response)
    )
    expect(await jsonrpc.send(request)).to.eql(response)
  })

  it('throws when response times out', async function () {
    td.when(channel.receive()).thenResolve(null) // timeout
    await expect(jsonrpc.send(request)).to.be.rejected()
  })

  it('can create a connect url', function () {
    const baseUrl = 'https://example.com'
    const url = 'https://example.com#connect'
    td.when(channel.createConnectUrl(baseUrl)).thenReturn(url)
    expect(jsonrpc.createConnectUrl(baseUrl)).to.equal(url)
  })
})
