import Web3 from 'web3'
import { CogitoProvider } from '../source/lib/cogito-provider'

describe('accounts', () => {
  const accounts = [
    '0x1234567890123456789012345678901234567890',
    '0x0123456789012345678901234567890123456789'
  ]

  let cogitoProvider
  let telepathChannel
  let web3

  describe('when cogito provides accounts', () => {
    const request = { method: 'accounts' }
    const response = { result: accounts }
    beforeEach(() => {
      telepathChannel = {
        send: jest.fn().mockReturnValue(Promise.resolve(response))
      }
      cogitoProvider = new CogitoProvider({ telepathChannel })
      web3 = new Web3(cogitoProvider)
    })

    it('call telepath send with proper request argument', (done) => {
      web3.eth.getAccounts((_, result) => {
        expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(request)
        done()
      })
    })

    it('returns the cogito accounts', (done) => {
      web3.eth.getAccounts((_, result) => {
        expect(result).toEqual(accounts)
        done()
      })
    })
  })

  describe('on failure', () => {
    const error = new Error('an error')
    beforeEach(() => {
      telepathChannel = {
        send: jest.fn().mockReturnValue(Promise.reject(error))
      }
      cogitoProvider = new CogitoProvider({ telepathChannel })
      web3 = new Web3(cogitoProvider)
    })

    it('throws when requesting accounts via telepath fails', (done) => {
      web3.eth.getAccounts((error, _) => {
        expect(error).toEqual(error)
        done()
      })
    })
  })
})
