/* eslint-env mocha */
const expect = require('chai').expect
const td = require('testdouble')
const anything = td.matchers.anything
const contains = td.matchers.contains
const Web3 = require('web3')
const CogitoProvider = require('../lib/provider')
const promisify = require('util.promisify')

describe('provider', function () {
  let cogitoProvider
  let originalProvider
  let telepathChannel
  let web3

  beforeEach(function () {
    originalProvider = td.object()
    telepathChannel = td.object()
    cogitoProvider = new CogitoProvider({ originalProvider, telepathChannel })
    web3 = new Web3(cogitoProvider)
    web3.eth.getAccounts = promisify(web3.eth.getAccounts)
    web3.eth.getBlockNumber = promisify(web3.eth.getBlockNumber)
  })

  it('requests ethereum accounts via telepath', async function () {
    const accounts = [ '0x1234', '0xabcd' ]
    const request = JSON.stringify({ method: 'accounts' })
    const response = JSON.stringify({ result: accounts })
    td.when(telepathChannel.send(request)).thenDo(function () {
      td.when(telepathChannel.receive(), { times: 1 }).thenResolve(response)
    })
    expect(await web3.eth.getAccounts()).to.eql(accounts)
  })

  context('when using cogito for signatures', function () {
    const transaction = { from: '0x1234567890123456789012345678901234567890' }
    const signed = '0xSignedTransaction'

    beforeEach(function () {
      const request = JSON.stringify({ method: 'sign', params: [ transaction ] })
      const response = JSON.stringify({ result: signed })
      td.when(telepathChannel.send(request)).thenDo(function () {
        td.when(telepathChannel.receive(), { times: 1 }).thenResolve(response)
      })
    })

    context('when using original provider for raw transactions', function () {
      const hash = '0xTransactionHash'

      beforeEach(function () {
        const request = { method: 'eth_sendRawTransaction', params: [ signed ] }
        const response = { jsonrpc: '2.0', result: hash, id: 1 }
        td.when(originalProvider.sendAsync(contains(request)))
          .thenCallback(null, response)
      })

      it('sends a cogito signed transaction', function (done) {
        web3.eth.sendTransaction(transaction, function (_, result) {
          expect(result).to.equal(hash)
          done()
        })
      })
    })
  })

  it('passes requests to the original provider', async function () {
    td.when(originalProvider.sendAsync(anything(), anything()))
      .thenDo(function (payload, callback) {
        callback(null, { jsonrpc: '2.0', id: payload.id, result: 42 })
      })
    expect(await web3.eth.getBlockNumber()).to.equal(42)
  })
})
