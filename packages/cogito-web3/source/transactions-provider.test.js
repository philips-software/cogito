import Web3 from 'web3'
import { CogitoProvider } from './cogito-provider'
import { isMatch } from 'lodash'

describe('sending transactions', () => {
  const transaction = {
    from: '0x1234567890123456789012345678901234567890',
    value: '0x10',
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

  beforeEach(() => {
    originalProvider = {
      payload: {},
      reject: false,
      lastPayload: '',
      expectedResult: function (result) {
        if (this.lastPayload === '') {
          this.payload['any'] = result
        } else {
          this.payload[this.lastPayload] = { ...this.payload[this.lastPayload], result }
        }
        return this
      },
      expectedPayload: function (payload) {
        this.lastPayload = JSON.stringify(payload)
        this.payload[this.lastPayload] = { request: payload }
        return this
      },
      setReject: function (reject) {
        this.reject = reject
        this.expectedResult('reject')
        return this
      },
      matchedInputFor: function (payload) {
        const match = Object.values(this.payload).find(({request}) => {
          return isMatch(payload, request)
        })
        return match ? match.result : this.payload['any']
      },
      send: function (payload, callback) {
        const result = this.matchedInputFor(payload)
        if (result) {
          if (this.reject && result === 'reject') {
            callback(new Error('an error'), null)
          } else {
            if (typeof result === 'object' && 'error' in result) {
              callback(null, { jsonrpc: '2.0', id: payload.id, error: result.error })
            } else {
              callback(null, { jsonrpc: '2.0', id: payload.id, result: result })
            }
          }
        }
      }
    }
    telepathChannel = {
      expectedRequest: {},
      expectedResponse: {},
      ignoreRequest: false,
      rejected: false,
      error: {},
      expectRequest: function (request) {
        this.expectedRequest = request
        return this
      },
      expectResponse: function (response) {
        this.expectedResponse = response
        return this
      },
      onAnyRequest: function () {
        this.ignoreRequest = true
        return this
      },
      reject: function () {
        this.rejected = true
        return this
      },
      rejectWithError: function (error) {
        this.rejected = true
        this.error = error
        return this
      },
      send: jest.fn(function (request) {
        if (!this.ignoreRequest) {
          if (typeof this.expectedRequest === 'object') {
            expect(request).toMatchObject(this.expectedRequest)
          } else {
            expect(request).toEqual(this.expectedRequest)
          }
        }
        if (this.rejected) {
          return Promise.reject(this.error)
        } else {
          return Promise.resolve(this.expectedResponse)
        }
      })
    }
    cogitoProvider = new CogitoProvider({ originalProvider, telepathChannel })
    web3 = new Web3(cogitoProvider)
  })

  const whenCogitoProvidesSignatures = () => {
    const anyTransaction = {}
    whenCogitoProvidesSignatureFor(anyTransaction)
  }

  const whenCogitoProvidesSignatureFor = (transaction) => {
    const request = { method: 'sign', params: [transaction] }
    const response = { result: signed }
    telepathChannel.expectRequest(request).expectResponse(response)
  }

  const whenProviderSendsRawTransaction = () => {
    const request = { method: 'eth_sendRawTransaction', params: [signed] }
    originalProvider.expectedPayload(request).expectedResult(hash)
  }

  const whenProviderThrowsWhileSendingRawTransaction = () => {
    const request = { method: 'eth_sendRawTransaction', params: [signed] }
    originalProvider.expectedPayload(request).setReject(true)
  }

  const whenProviderReturnsErrorWhileSendingRawTransaction = () => {
    const request = { method: 'eth_sendRawTransaction', params: [signed] }
    const error = { code: -42, message: 'an error' }
    originalProvider.expectedPayload(request).expectedResult({ error })
  }

  const sendTransaction = async (transaction) => {
    return new Promise((resolve, reject) => {
      web3.eth.sendTransaction(transaction, (error, result) => {
        error ? reject(error) : resolve(result)
      })
    })
  }

  it('sends a cogito signed transaction', async () => {
    whenCogitoProvidesSignatureFor(transaction)
    whenProviderSendsRawTransaction()
    expect(await sendTransaction(transaction)).toBe(hash)
  })

  it('throws when signing via telepath fails', async () => {
    const error = 'telepath error'
    telepathChannel.onAnyRequest().rejectWithError(new Error(error))
    await expect(sendTransaction(transaction)).rejects.toThrow(error)
  })

  it('throws when telepath times out', async () => {
    telepathChannel.onAnyRequest().expectResponse(null)
    await expect(sendTransaction(transaction)).rejects.toThrow('timeout')
  })

  it('throws when cogito returns an error', async () => {
    const response = { error: { message: 'cogito error', code: -42 } }
    telepathChannel.onAnyRequest().expectResponse(response)
    await expect(sendTransaction(transaction)).rejects.toThrow('cogito error')
  })

  describe('when a transaction property is not provided', async () => {
    const withoutValue = { ...transaction }
    delete withoutValue.value

    const verifyValue = (value) => {
      const expectedRequest = { method: 'sign', params: [{ value }] }
      expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(expectedRequest)
    }

    it('sets transaction defaults', async () => {
      whenCogitoProvidesSignatures()
      whenProviderSendsRawTransaction()

      await sendTransaction(withoutValue)

      verifyValue('0x0')
    })
  })

  it('transaction nonce is unchanged when provided', async () => {
    whenCogitoProvidesSignatures()
    whenProviderSendsRawTransaction()

    await sendTransaction(transaction)

    const expectedRequest = { method: 'sign', params: [transaction] }
    expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(expectedRequest)
  })

  describe('when transaction nonce is is not provided', () => {
    const withoutNonce = { ...transaction }
    delete withoutNonce.nonce

    const transactionCountRequest = {
      method: 'eth_getTransactionCount',
      params: [ transaction.from, 'pending' ]
    }

    const whenProviderReturnsTransactionCount = (count) => {
      originalProvider.expectedPayload(transactionCountRequest).expectedResult(count)
    }

    const whenProviderThrowsWhenRequestingTransactionCount = () => {
      originalProvider.expectedPayload(transactionCountRequest).setReject(true)
    }

    const verifyNonce = (nonce, options = {}) => {
      const expectedRequest = { method: 'sign', params: [{ nonce }] }
      if (options.times) {
        [...Array(options.times).keys()].forEach((index) => {
          expect(telepathChannel.send.mock.calls[index][0]).toMatchObject(expectedRequest)
        })
      } else {
        const numberOfCalls = telepathChannel.send.mock.calls.length
        expect(numberOfCalls).toBeGreaterThan(0)
        expect(telepathChannel.send.mock.calls[numberOfCalls - 1][0]).toMatchObject(expectedRequest)
      }
    }

    it('is set to transaction count when not specified', async () => {
      whenProviderReturnsTransactionCount('0x42')
      whenCogitoProvidesSignatures()
      whenProviderSendsRawTransaction()

      await sendTransaction(withoutNonce)

      verifyNonce('0x42')
    })

    it('increments for successful transactions', async () => {
      whenProviderReturnsTransactionCount('0x42')
      whenCogitoProvidesSignatures()
      whenProviderSendsRawTransaction()

      await sendTransaction(withoutNonce)
      await sendTransaction(withoutNonce)

      verifyNonce('0x43')
    })

    it('does not increment for transactions that throw', async () => {
      whenProviderReturnsTransactionCount('0x42')
      whenCogitoProvidesSignatures()
      whenProviderThrowsWhileSendingRawTransaction()

      try { await sendTransaction(withoutNonce) } catch (_) {}
      try { await sendTransaction(withoutNonce) } catch (_) {}

      verifyNonce('0x42', { times: 2 })
    })

    it('does not increment for transactions that err', async () => {
      whenProviderReturnsTransactionCount('0x42')
      whenCogitoProvidesSignatures()
      whenProviderReturnsErrorWhileSendingRawTransaction()

      try { await sendTransaction(withoutNonce) } catch (_) {}
      try { await sendTransaction(withoutNonce) } catch (_) {}

      verifyNonce('0x42', { times: 2 })
    })

    it('throws when transaction count cannot be determined', async () => {
      whenProviderThrowsWhenRequestingTransactionCount()
      whenCogitoProvidesSignatures()
      whenProviderSendsRawTransaction()
      await expect(sendTransaction(withoutNonce)).rejects.toThrow('an error')
    })
  })
})
