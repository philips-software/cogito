const expect = require('chai').expect
const td = require('testdouble')
const anything = td.matchers.anything
const contains = td.matchers.contains
const { stubResponse, stubResponseError } = require('./provider-stubbing')
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
  const signed = '0xSignedTransaction'
  const hash = '0xTransactionHash'

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

  function whenCogitoProvidesSignature () {
    whenCogitoProvidesSignatureFor(transaction)
  }

  function whenCogitoProvidesSignatureFor (transaction) {
    const request = { method: 'sign', params: [transaction] }
    const response = { result: signed }
    td.when(telepathChannel.send(contains(request))).thenResolve(response)
  }

  function whenOriginalProviderSendsRawTransaction () {
    const sendRaw = { method: 'eth_sendRawTransaction', params: [signed] }
    stubResponse(originalProvider, contains(sendRaw), hash)
  }

  function whenOriginalProviderThrowsWhileSendingRawTransaction () {
    const sendRaw = { method: 'eth_sendRawTransaction', params: [signed] }
    stubResponseError(originalProvider, contains(sendRaw))
  }

  async function sendTransaction (transaction) {
    return new Promise(function (resolve, reject) {
      web3.eth.sendTransaction(transaction, function (error, result) {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }

  it('sends a cogito signed transaction', async function () {
    whenCogitoProvidesSignature()
    whenOriginalProviderSendsRawTransaction()
    expect(await sendTransaction(transaction)).to.equal(hash)
  })

  it('throws when signing via telepath fails', async function () {
    td.when(telepathChannel.send(anything())).thenReject(new Error('an error'))
    await expect(sendTransaction(transaction)).to.be.rejectedWith(/an error/)
  })

  it('throws when telepath times out', async function () {
    td.when(telepathChannel.send(anything())).thenResolve(null)
    await expect(sendTransaction(transaction)).to.be.rejectedWith(/timeout/)
  })

  it('throws when cogito returns an error', async function () {
    const response = { error: { message: 'some error', code: -42 } }
    td.when(telepathChannel.send(anything())).thenResolve(response)
    await expect(sendTransaction(transaction)).to.be.rejectedWith(/some error/)
  })

  it('sets transaction defaults', async function () {
    whenCogitoProvidesSignature()
    whenOriginalProviderSendsRawTransaction()
    await sendTransaction(transaction)
    const transactionWithDefaults = Object.assign({ value: '0x0' }, transaction)
    const expectedRequest = { method: 'sign', params: [transactionWithDefaults] }
    td.verify(telepathChannel.send(contains(expectedRequest)))
  })

  describe('transaction nonces', function () {
    const withoutNonce = Object.assign({}, transaction)
    delete withoutNonce.nonce

    const transactionCountRequest = {
      method: 'eth_getTransactionCount',
      params: [ transaction.from, 'pending' ]
    }

    it('is equal to transaction count when not specified', async function () {
      stubResponse(originalProvider, contains(transactionCountRequest), '0x42')
      whenCogitoProvidesSignatureFor({ ...transaction, nonce: '0x42' })
      whenOriginalProviderSendsRawTransaction()
      await sendTransaction(withoutNonce)
      const expectedRequest = { method: 'sign', params: [{ nonce: '0x42' }] }
      td.verify(telepathChannel.send(contains(expectedRequest)))
    })

    it('increments for successful transactions', async function () {
      stubResponse(originalProvider, contains(transactionCountRequest), '0x42')
      whenCogitoProvidesSignatureFor({ ...transaction, nonce: '0x42' })
      whenCogitoProvidesSignatureFor({ ...transaction, nonce: '0x43' })
      whenOriginalProviderSendsRawTransaction()
      await sendTransaction(withoutNonce)
      await sendTransaction(withoutNonce)
      const expectedRequest = { method: 'sign', params: [{ nonce: '0x43' }] }
      td.verify(telepathChannel.send(contains(expectedRequest)))
    })

    it('does not increment for transactions that fail', async function () {
      stubResponse(originalProvider, contains(transactionCountRequest), '0x42')
      whenCogitoProvidesSignatureFor({ ...transaction, nonce: '0x42' })
      whenCogitoProvidesSignatureFor({ ...transaction, nonce: '0x43' })
      whenOriginalProviderThrowsWhileSendingRawTransaction()
      try { await sendTransaction(withoutNonce) } catch (_) {}
      try { await sendTransaction(withoutNonce) } catch (_) {}
      const expectedRequest = { method: 'sign', params: [{ nonce: '0x42' }] }
      td.verify(telepathChannel.send(contains(expectedRequest)), { times: 2 })
    })

    it('is unchanged when defined', async function () {
      whenCogitoProvidesSignature()
      whenOriginalProviderSendsRawTransaction()
      await sendTransaction(transaction)
      const expectedRequest = { method: 'sign', params: [transaction] }
      td.verify(telepathChannel.send(contains(expectedRequest)))
    })

    it('throws when transaction count cannot be determined', async function () {
      stubResponseError(originalProvider, contains(transactionCountRequest))
      whenCogitoProvidesSignature()
      whenOriginalProviderSendsRawTransaction()
      await expect(sendTransaction(withoutNonce)).to.be.rejected()
    })
  })
})
