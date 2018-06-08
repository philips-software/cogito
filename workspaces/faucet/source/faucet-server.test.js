import request from 'supertest'
import FaucetServer from './faucet-server'

describe('Server', () => {
  let getTransactionCount
  let sendSignedTransaction
  let faucetServer
  let netGetId

  const chainId = 123456

  const config = {
    providerUrl: 'http://localhost:8545',
    account: '0x1111111111111111111111111111111111111111',
    privateKey: '1111111111111111111111111111111111111111111111111111111111111111',
    donationInEther: '0.001',
    donationTxGas: 21000
  }

  beforeEach(() => {
    faucetServer = new FaucetServer(config)

    getTransactionCount = faucetServer.web3.eth.getTransactionCount = jest.fn()
    sendSignedTransaction = faucetServer.web3.eth.sendSignedTransaction = jest.fn()
    netGetId = faucetServer.web3.eth.net.getId = jest.fn()
  })

  describe('happy flow', () => {
    const transactionCount = 42

    beforeEach(() => {
      getTransactionCount.mockReturnValueOnce(Promise.resolve(transactionCount))
      sendSignedTransaction.mockReturnValueOnce(Promise.resolve({status: true}))
      netGetId.mockReturnValueOnce(Promise.resolve(chainId))
      console.log = jest.fn()
    })

    it('supports donate URL', async () => {
      const address = '0x0000000000000000000000000000000000000001'
      await request(faucetServer.server).post(`/donate/${address}`).expect(200)
    })

    it('has a web3 instance', () => {
      expect(faucetServer.web3.currentProvider.host).toBe(config.providerUrl)
    })

    describe('transaction parameters', () => {
      let params

      beforeEach(async () => {
        params = await faucetServer.createTransactionParameters({to: '0xaddr'})
      })

      it('uses to from passed parameters', () => {
        expect(params.to).toBe('0xaddr')
      })

      it('uses value from config', () => {
        const expectedValue = faucetServer.web3.utils.toHex(faucetServer.web3.utils.toWei(config.donationInEther, 'ether'))
        expect(params.value).toBe(expectedValue)
      })

      it('uses gas from config', () => {
        expect(params.gas).toBe(config.donationTxGas)
      })

      it('uses transaction count for nonce', () => {
        expect(params.nonce).toBe(transactionCount)
      })

      it('has the right chain id', () => {
        expect(params.chainId).toBe(chainId)
      })
    })

    describe('given some transaction parameters', () => {
      const transactionDetails = {
        to: '0x2222222222222222222222222222222222222222',
        value: '123',
        gas: '12345',
        nonce: '8',
        chainId: '123456'
      }
      let createTransactionParameters

      beforeEach(() => {
        createTransactionParameters = faucetServer.createTransactionParameters = jest.fn()
        createTransactionParameters.mockReturnValue(Promise.resolve(transactionDetails))
      })

      it('creates a signed transaction with proper details', async () => {
        const transaction = await faucetServer.createTransaction({ to: transactionDetails.to })
        expect(createTransactionParameters.mock.calls.length).toBe(1)
        expect(createTransactionParameters.mock.calls[0][0].to).toBe(transactionDetails.to)
        expect(transaction.v.length).toBe(3)
        expect(transaction.r.length).toBe(32)
        expect(transaction.s.length).toBe(32)
      })

      it('sends the transaction', async () => {
        const transaction = await faucetServer.createTransaction({ to: transactionDetails.to })
        await faucetServer.sendTransaction({ transaction })
        expect(sendSignedTransaction.mock.calls.length).toBe(1)
      })

      it('creates and sends the transaction', async () => {
        await faucetServer.sendDonateTransaction({ to: transactionDetails.to })
        expect(createTransactionParameters.mock.calls[0][0].to).toBe(transactionDetails.to)
        expect(sendSignedTransaction.mock.calls.length).toBe(1)
      })

      it('logs success', async () => {
        const request = { params: { address: '0x3333333333333333333333333333333333333333' } }
        let status = jest.fn()
        const send = jest.fn()
        status.mockReturnValue({ send })
        const response = { status }

        await faucetServer.donate(request, response)
        expect(console.log.mock.calls[0][0]).toContain(`donated ${config.donationInEther} ether to ${request.params.address}`)
      })
    })
  })

  describe('errors', () => {
    beforeEach(() => {
      getTransactionCount.mockReturnValueOnce(Promise.reject(new Error('some error')))
      sendSignedTransaction.mockReturnValueOnce(Promise.resolve({status: true}))
      console.error = jest.fn()
      console.error.mockClear()
    })

    it('reports errors', async () => {
      const request = { params: { address: '0x3333333333333333333333333333333333333333' } }
      let status = jest.fn()
      const send = jest.fn()
      status.mockReturnValue({ send })
      const response = { status }
      await faucetServer.donate(request, response)
      expect(status.mock.calls[0][0]).toBe(500)
      expect(send.mock.calls[0][0]).toContain('some error')
      expect(console.error.mock.calls.length).toBe(1)
    })
  })
})
