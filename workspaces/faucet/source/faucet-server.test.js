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

    afterEach(() => {
      console.log.mockRestore()
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
    })

    afterEach(() => {
      console.error.mockRestore()
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

  describe('scheduling', () => {
    class DonationControlledMock {
      fulfilStatus = false
      maxExpectedQueueSize
      counter = 10

      waiter = (resolve, reject) => {
        setTimeout(() => {
          console.log('fulfilStatus=', this.fulfilStatus)
          console.log('counter=', this.counter)
          console.log('queue=', faucetServer.queue.length)
          if (this.fulfilStatus) {
            expect(faucetServer.queue.length).toBe(this.maxExpectedQueueSize)
            resolve({status: true})
          } else if (this.counter === 0) {
            reject(new Error('timeout'))
          } else {
            this.counter = this.counter - 1
            this.waiter(resolve, reject)
          }
        }, 100)
      }

      constructor (maxExpectedQueueSize) {
        this.maxExpectedQueueSize = maxExpectedQueueSize
      }

      fulfil () {
        this.fulfilStatus = true
      }

      getPromiseExecutor () {
        return this.waiter
      }
    }

    beforeEach(() => {
      console.log = jest.fn()
    })

    afterEach(() => {
      console.log.mockRestore()
    })

    it('immediately schedules a donator call when no previous call is present', async () => {
      expect(faucetServer.queue.length).toBe(0)

      donate.mockResolvedValueOnce({status: true})

      const address = '0x0000000000000000000000000000000000000001'
      await request(faucetServer.server)
        .post(`/donate/${address}`)
        .expect(200)
    })

    it('puts a request on a waiting queue and removes the item from the queue after it is served', done => {
      const donationControlledMock = new DonationControlledMock(1)
      donate.mockImplementationOnce(() => {
        return new Promise(donationControlledMock.getPromiseExecutor())
      })

      const address = '0x0000000000000000000000000000000000000001'
      request(faucetServer.server)
        .post(`/donate/${address}`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(faucetServer.queue.length).toBe(0)
            done()
          }
        })
      donationControlledMock.fulfil()
    })

    it('keeps request on the waiting queue before previous one is finished', done => {
      const donationControlledMock1 = new DonationControlledMock(2)
      const donationControlledMock2 = new DonationControlledMock(1)
      donate
        .mockImplementationOnce(() => {
          return new Promise(donationControlledMock1.getPromiseExecutor())
        })
        .mockImplementationOnce(() => {
          return new Promise(donationControlledMock2.getPromiseExecutor())
        })

      const address = '0x0000000000000000000000000000000000000001'
      request(faucetServer.server)
        .post(`/donate/${address}`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(faucetServer.queue.length).toBe(1)
          }
        })
      request(faucetServer.server)
        .post(`/donate/${address}`)
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err)
          } else {
            expect(faucetServer.queue.length).toBe(0)
            done()
          }
        })
      donationControlledMock1.fulfil()
      donationControlledMock2.fulfil()
    })
  })
})
