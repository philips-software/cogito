import { Donator } from './donator'

describe('Donator', () => {
  let getNonce
  let sendSignedTransaction
  let donator
  let netGetId

  const chainId = 123456

  const config = {
    providerUrl: 'http://localhost:8545',
    account: '0x1111111111111111111111111111111111111111',
    privateKey: '1111111111111111111111111111111111111111111111111111111111111111',
    donationInEther: '0.001'
  }

  beforeEach(() => {
    donator = new Donator(config)

    getNonce = donator.nonces.getNonce = jest.fn()
    sendSignedTransaction = donator.web3.eth.sendSignedTransaction = jest.fn()
    netGetId = donator.web3.eth.net.getId = jest.fn()
  })

  describe('happy flow', () => {
    const transactionCount = 42

    beforeEach(() => {
      getNonce.mockReturnValueOnce(Promise.resolve(transactionCount))
      sendSignedTransaction.mockReturnValueOnce(Promise.resolve({status: true}))
      netGetId.mockReturnValueOnce(Promise.resolve(chainId))
      console.log = jest.fn()
    })

    it('has a web3 instance', () => {
      expect(donator.web3.currentProvider.host).toBe(config.providerUrl)
    })

    describe('transaction parameters', () => {
      let params

      beforeEach(async () => {
        params = await donator.createTransactionParameters({to: '0xaddr'})
      })

      it('uses to from passed parameters', () => {
        expect(params.to).toBe('0xaddr')
      })

      it('uses value from config', () => {
        const expectedValue = donator.web3.utils.toHex(donator.web3.utils.toWei(config.donationInEther, 'ether'))
        expect(params.value).toBe(expectedValue)
      })

      it('uses correct gas amount for a transfer', () => {
        expect(params.gas).toBe(21000)
      })

      it('uses nonce returned by TransactionNonces', () => {
        expect(params.nonce).toBe(transactionCount)
      })

      it('has the right chain id', () => {
        expect(params.chainId).toBe(chainId)
      })
    })

    describe('given some transaction parameters', () => {
      const transactionParameters = {
        to: '0x2222222222222222222222222222222222222222',
        value: '123',
        gas: '12345',
        nonce: 8,
        chainId: '123456'
      }
      let createTransactionParameters

      beforeEach(() => {
        createTransactionParameters = donator.createTransactionParameters = jest.fn()
        createTransactionParameters.mockReturnValue(Promise.resolve(transactionParameters))
      })

      it('creates a signed transaction with proper details', async () => {
        const transaction = await donator.createTransaction({ to: transactionParameters.to })
        expect(createTransactionParameters.mock.calls.length).toBe(1)
        expect(createTransactionParameters.mock.calls[0][0].to).toBe(transactionParameters.to)
        expect(transaction.v.length).toBe(3)
        expect(transaction.r.length).toBe(32)
        expect(transaction.s.length).toBe(32)
      })

      it('sends the transaction', async () => {
        const transaction = await donator.createTransaction({ to: transactionParameters.to })
        await donator.sendTransaction({ transaction })
        expect(sendSignedTransaction.mock.calls.length).toBe(1)
      })

      it('creates and sends the transaction', async () => {
        await donator.sendDonateTransaction({ to: transactionParameters.to })
        expect(createTransactionParameters.mock.calls[0][0].to).toBe(transactionParameters.to)
        expect(sendSignedTransaction.mock.calls.length).toBe(1)
      })

      it('logs success', async () => {
        const address = '0x3333333333333333333333333333333333333333'

        await donator.donate({ to: address })
        expect(console.log.mock.calls[0][0]).toContain(`donated ${config.donationInEther} ether to ${address}`)
      })
    })
  })

  describe('errors', () => {
    it('throws error if getting nonce from TransactionNonces throws', async () => {
      const error = new Error('some error')
      getNonce.mockRejectedValueOnce(error)
      const address = '0x3333333333333333333333333333333333333333'
      await expect(donator.donate({ to: address })).rejects.toThrowError(error)
    })

    it('throws error if getting the network id fails', async () => {
      const error = new Error('some error')
      getNonce.mockResolvedValueOnce(42)
      netGetId.mockRejectedValueOnce(error)
      const address = '0x3333333333333333333333333333333333333333'
      await expect(donator.donate({ to: address })).rejects.toThrowError(error)
    })

    it('throws error if sendSignedTransaction fails', async () => {
      const error = new Error('some error')
      getNonce.mockResolvedValueOnce(42)
      netGetId.mockResolvedValueOnce(chainId)
      sendSignedTransaction.mockRejectedValueOnce(error)
      const address = '0x3333333333333333333333333333333333333333'
      await expect(donator.donate({ to: address })).rejects.toThrowError(error)
    })
  })
})
