const expect = require('chai').expect
const td = require('testdouble')
const anything = td.matchers.anything
const contains = td.matchers.contains
const { stubResponse } = require('./provider-stubbing')
const Web3 = require('web3')
const CogitoProvider = require('../lib/provider')

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
  })

  describe('accounts', function () {
    const accounts = [
      '0x1234567890123456789012345678901234567890',
      '0x0123456789012345678901234567890123456789'
    ]

    context('when cogito provides accounts', function () {
      beforeEach(function () {
        const request = { method: 'accounts' }
        const response = { result: accounts }
        td.when(telepathChannel.send(contains(request))).thenResolve(response)
      })

      it('returns the cogito accounts', function (done) {
        web3.eth.getAccounts(function (_, result) {
          expect(result).to.eql(accounts)
          done()
        })
      })
    })

    it('throws when requesting accounts via telepath fails', function (done) {
      td.when(telepathChannel.send(anything())).thenReject(new Error('an error'))
      web3.eth.getAccounts(function (error, _) {
        expect(error).to.not.be.null()
        done()
      })
    })
  })

  describe('signed transactions', function () {
    const transaction = {
      from: '0x1234567890123456789012345678901234567890',
      gasPrice: '0x123'
    }

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
  })

  it('passes requests to the original provider', function (done) {
    stubResponse(originalProvider, anything(), 42)
    web3.eth.getBlockNumber(function (_, result) {
      expect(result).to.equal(42)
      done()
    })
  })
})
