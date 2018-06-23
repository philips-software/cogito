import request from 'supertest'
import FaucetServer from './faucet-server'

describe('Server', () => {
  const config = {
    donationInEther: '0.001'
  }

  let faucetServer
  let donate

  beforeEach(() => {
    faucetServer = new FaucetServer(config)

    donate = jest.fn()
    faucetServer.donator = {
      donate
    }
  })

  describe('happy flow', () => {
    beforeEach(() => {
      donate.mockResolvedValueOnce({status: true})
      console.log = jest.fn()
    })

    it('supports donate URL', async () => {
      const address = '0x0000000000000000000000000000000000000001'
      await request(faucetServer.server)
        .post(`/donate/${address}`)
        .expect(200)
    })

    it('returns correct message on success', async () => {
      const address = '0x0000000000000000000000000000000000000001'
      await request(faucetServer.server)
        .post(`/donate/${address}`)
        .expect(200, JSON.stringify({status: true}))
    })
  })

  describe('errors', () => {
    beforeEach(() => {
      console.error = jest.fn()
      console.error.mockClear()
    })

    it('returns response status 500', async () => {
      const address = '0x0000000000000000000000000000000000000001'
      const error = new Error('some error 2')

      // THIS DOES NOT WORK FOR ERROR HANDLING - DO NOT KNOW WHY!
      // donate.mockReturnValueOnce(Promise.reject(error))
      // and
      // donate.mockRejectedValueOnce(error)
      donate.mockImplementationOnce(() => {
        return Promise.reject(error)
      })

      await request(faucetServer.server)
        .post(`/donate/${address}`)
        .expect(500)
    })

    it('returns correct error message when error does not have response.statusText field', async () => {
      const address = '0x0000000000000000000000000000000000000001'
      const error = new Error('some error 2')

      // THIS DOES NOT WORK FOR ERROR HANDLING - DO NOT KNOW WHY!
      // donate.mockReturnValueOnce(Promise.reject(error))
      // and
      // donate.mockRejectedValueOnce(error)
      donate.mockImplementationOnce(() => {
        return Promise.reject(error)
      })

      await request(faucetServer.server)
        .post(`/donate/${address}`)
        .expect('some error 2 - please check logs')
    })

    it('returns correct error message when error has response.statusText field', async () => {
      const address = '0x0000000000000000000000000000000000000001'
      class CustomError extends Error {
        constructor (statusText, message, ...params) {
          super(message, ...params)
          Error.captureStackTrace(this, CustomError)
          this.response = {
            statusText
          }
          this.message = message
        }
      }
      const error = new CustomError('error status text', 'error message')

      // THIS DOES NOT WORK FOR ERROR HANDLING - DO NOT KNOW WHY!
      // donate.mockReturnValueOnce(Promise.reject(error))
      // and
      // donate.mockRejectedValueOnce(error)
      donate.mockImplementationOnce(() => {
        return Promise.reject(error)
      })

      await request(faucetServer.server)
        .post(`/donate/${address}`)
        .expect('error message - error status text')
    })
  })
})
