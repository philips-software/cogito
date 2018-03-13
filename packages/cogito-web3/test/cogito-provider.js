import Web3 from 'web3'
import { CogitoProvider } from '../source/cogito-provider'

describe('provider', () => {
  let cogitoProvider
  let originalProvider
  let web3

  beforeEach(() => {
    originalProvider = {
      result: 0,
      expectedResult: function (result) {
        this.result = result
      },
      send: function (payload, callback) {
        const error = null
        callback(error, { jsonrpc: '2.0', id: payload.id, result: this.result })
      }
    }
    cogitoProvider = new CogitoProvider({ originalProvider })
    web3 = new Web3(cogitoProvider)
  })

  it('passes requests to the original provider', (done) => {
    const expectedResult = 42
    originalProvider.expectedResult(expectedResult)
    web3.eth.getBlockNumber((_, result) => {
      expect(result).toEqual(expectedResult)
      done()
    })
  })
})
