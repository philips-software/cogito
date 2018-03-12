import Web3 from 'web3'
import { CogitoProvider } from '../source/lib/cogito-provider'

describe('sending transactions', function () {
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

  beforeEach(function () {
    // originalProvider = td.object()
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
        const match = Object.entries(this.payload).find(([key, {request}]) => {
          if (typeof payload === 'object' && typeof request === 'object') {
            for (key in request) {
              if (key in payload) {
                if (JSON.stringify(payload[key]) !== JSON.stringify(request[key])) {
                  return false
                } else continue
              }
              return false
            }
            return true
          } else if (payload === request) {
            return true
          }
          return false
        })
        if (match.length === 2) {
          return match[1].result
        } else {
          return this.payload['any']
        }
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

  function whenCogitoProvidesSignatures () {
    const anyTransaction = {}
    whenCogitoProvidesSignatureFor(anyTransaction)
  }

  function whenCogitoProvidesSignatureFor (transaction) {
    const request = { method: 'sign', params: [transaction] }
    const response = { result: signed }
    telepathChannel.expectRequest(request).expectResponse(response)
    // td.when(telepathChannel.send(contains(request))).thenResolve(response)
  }

  function whenProviderSendsRawTransaction () {
    const request = { method: 'eth_sendRawTransaction', params: [signed] }
    // stubResponse(originalProvider, contains(request), hash)
    originalProvider.expectedPayload(request).expectedResult(hash)
  }

  function whenProviderThrowsWhileSendingRawTransaction () {
    const request = { method: 'eth_sendRawTransaction', params: [signed] }
    originalProvider.expectedPayload(request).setReject(true)
    // stubResponseReject(originalProvider, contains(request))
  }

  function whenProviderReturnsErrorWhileSendingRawTransaction () {
    const request = { method: 'eth_sendRawTransaction', params: [signed] }
    const error = { code: -42, message: 'an error' }
    originalProvider.expectedPayload(request).expectedResult({ error })
    // stubResponseError(originalProvider, contains(request), error)
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
    whenCogitoProvidesSignatureFor(transaction)
    whenProviderSendsRawTransaction()
    expect(await sendTransaction(transaction)).toBe(hash)
  })

  it('throws when signing via telepath fails', async function () {
    const error = 'telepath error'
    telepathChannel.onAnyRequest().rejectWithError(new Error(error))
    // td.when(telepathChannel.send(anything())).thenReject(new Error('telepath error'))
    await expect(sendTransaction(transaction)).rejects.toThrow(error)
    // await expect(sendTransaction(transaction)).to.be.rejectedWith(/telepath error/)
  })

  it('throws when telepath times out', async function () {
    // td.when(telepathChannel.send(anything())).thenResolve(null)
    telepathChannel.onAnyRequest().expectResponse(null)
    await expect(sendTransaction(transaction)).rejects.toThrow('timeout')
    // await expect(sendTransaction(transaction)).to.be.rejectedWith(/timeout/)
  })

  it('throws when cogito returns an error', async function () {
    const response = { error: { message: 'cogito error', code: -42 } }
    telepathChannel.onAnyRequest().expectResponse(response)
    // td.when(telepathChannel.send(anything())).thenResolve(response)
    // await expect(sendTransaction(transaction)).to.be.rejectedWith(/cogito error/)
    await expect(sendTransaction(transaction)).rejects.toThrow('cogito error')
  })

  describe('when a transaction property is not provided', async () => {
    const withoutValue = { ...transaction }
    delete withoutValue.value

    function verifyValue (value) {
      const expectedRequest = { method: 'sign', params: [{ value }] }
      expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(expectedRequest)
      // td.verify(telepathChannel.send(contains(expectedRequest)))
    }

    it('sets transaction defaults', async function () {
      whenCogitoProvidesSignatures()
      whenProviderSendsRawTransaction()

      await sendTransaction(withoutValue)

      verifyValue('0x0')
    })
  })

  it('transaction nonce is unchanged when provided', async function () {
    whenCogitoProvidesSignatures()
    whenProviderSendsRawTransaction()

    await sendTransaction(transaction)

    const expectedRequest = { method: 'sign', params: [transaction] }
    expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(expectedRequest)
    // td.verify(telepathChannel.send(contains(expectedRequest)))
  })

  describe('when transaction nonce is is not provided', function () {
    const withoutNonce = { ...transaction }
    delete withoutNonce.nonce

    const transactionCountRequest = {
      method: 'eth_getTransactionCount',
      params: [ transaction.from, 'pending' ]
    }

    function whenProviderReturnsTransactionCount (count) {
      originalProvider.expectedPayload(transactionCountRequest).expectedResult(count)
      // stubResponse(originalProvider, contains(transactionCountRequest), count)
    }

    function whenProviderThrowsWhenRequestingTransactionCount () {
      originalProvider.expectedPayload(transactionCountRequest).setReject(true)
      // stubResponseReject(originalProvider, contains(transactionCountRequest))
    }

    function verifyNonce (nonce, options = {}) {
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
      // td.verify(telepathChannel.send(contains(expectedRequest)), options)
    }

    it('is set to transaction count when not specified', async function () {
      whenProviderReturnsTransactionCount('0x42')
      whenCogitoProvidesSignatures()
      whenProviderSendsRawTransaction()

      await sendTransaction(withoutNonce)

      verifyNonce('0x42')
    })

    it('increments for successful transactions', async function () {
      whenProviderReturnsTransactionCount('0x42')
      whenCogitoProvidesSignatures()
      whenProviderSendsRawTransaction()

      await sendTransaction(withoutNonce)
      await sendTransaction(withoutNonce)

      verifyNonce('0x43')
    })

    it('does not increment for transactions that throw', async function () {
      whenProviderReturnsTransactionCount('0x42')
      whenCogitoProvidesSignatures()
      whenProviderThrowsWhileSendingRawTransaction()

      try { await sendTransaction(withoutNonce) } catch (_) {}
      try { await sendTransaction(withoutNonce) } catch (_) {}

      verifyNonce('0x42', { times: 2 })
    })

    it('does not increment for transactions that err', async function () {
      whenProviderReturnsTransactionCount('0x42')
      whenCogitoProvidesSignatures()
      whenProviderReturnsErrorWhileSendingRawTransaction()

      try { await sendTransaction(withoutNonce) } catch (_) {}
      try { await sendTransaction(withoutNonce) } catch (_) {}

      verifyNonce('0x42', { times: 2 })
    })

    it('throws when transaction count cannot be determined', async function () {
      whenProviderThrowsWhenRequestingTransactionCount()
      whenCogitoProvidesSignatures()
      whenProviderSendsRawTransaction()
      await expect(sendTransaction(withoutNonce)).rejects.toThrow('an error')
      // await expect(sendTransaction(withoutNonce)).to.be.rejected()
    })
  })
})
