const expect = require('chai').expect
const td = require('testdouble')
const anything = td.matchers.anything
const contains = td.matchers.contains
const { stubResponse } = require('./provider-stubbing')
const Web3 = require('web3')
const CogitoProvider = require('../source/lib/cogito-provider')

describe('sending transactions', function () {
  const transaction = {
    from: '0x1234567890123456789012345678901234567890',
    gasPrice: '0x20',
    nonce: '0x30',
    gas: '0x40',
    chainId: 50
  }

  let cogitoProvider
  let originalProvider
  let telepathChannel
  let web3

  beforeEach(function () {
    originalProvider = td.object()
    telepathChannel = td.object()
    cogitoProvider = new CogitoProvider({ originalProvider, telepathChannel })
    web3 = new Web3(cogitoProvider)
  })

  context('when cogito provides signatures', function () {
    const signed = '0xSignedTransaction'

    beforeEach(function () {
      const request = { method: 'sign', params: [transaction] }
      const response = { result: signed }
      td.when(telepathChannel.send(contains(request))).thenResolve(response)
    })

    context('when using original provider for raw transactions', function () {
      const hash = '0xTransactionHash'

      beforeEach(function () {
        const sendRaw = { method: 'eth_sendRawTransaction', params: [signed] }
        stubResponse(originalProvider, contains(sendRaw), hash)
      })

      it('sends a cogito signed transaction', function (done) {
        web3.eth.sendTransaction(transaction, function (_, result) {
          expect(result).to.equal(hash)
          done()
        })
      })
    })
  })

  it('throws when signing via telepath fails', function (done) {
    td.when(telepathChannel.send(anything())).thenReject(new Error('an error'))
    web3.eth.sendTransaction(transaction, function (error, _) {
      expect(error).to.not.be.null()
      done()
    })
  })

  it('throws when cogito returns an error', function (done) {
    const response = { error: { message: 'some error', code: -42 } }
    td.when(telepathChannel.send(anything())).thenResolve(response)
    web3.eth.sendTransaction(transaction, function (error, _) {
      expect(error).to.not.be.null()
      done()
    })
  })

  it('sets transaction defaults', function (done) {
    const transactionWithDefaults = Object.assign({ value: '0x0' }, transaction)
    const expectedRequest = { method: 'sign', params: [transactionWithDefaults] }
    web3.eth.sendTransaction(transaction, function () {
      td.verify(telepathChannel.send(contains(expectedRequest)))
      done()
    })
  })
})
