import { TransactionDefaults } from './transaction-defaults'

describe('transaction defaults', () => {
  const transaction = {
    from: '0x1234567890123456789012345678901234567890',
    value: '0x10',
    gasPrice: '0x20',
    nonce: '0x30',
    gas: '0x40',
    chainId: 50
  }

  let transactionDefaults
  let provider

  beforeEach(() => {
    provider = {
      result: 0,
      payload: {},
      reject: false,
      expectedResult: function (result) {
        this.result = result
        return this
      },
      expectedPayload: function (payload) {
        this.payload = payload
        return this
      },
      setReject: function (reject) {
        this.reject = reject
        return this
      },
      send: function (payload, callback) {
        expect(payload).toMatchObject(this.payload)
        if (this.reject) {
          callback(new Error('an error'), null)
        } else {
          callback(null, { jsonrpc: '2.0', id: payload.id, result: this.result })
        }
      }
    }
    transactionDefaults = new TransactionDefaults({ provider })
  })

  describe('value', () => {
    const noValue = { ...transaction }
    delete noValue.value

    it('is 0 when not defined', async () => {
      const defaults = await transactionDefaults.apply(noValue)
      expect(defaults.value).toBe('0x0')
    })

    it('is unchanged when defined', async () => {
      const defaults = await transactionDefaults.apply(transaction)
      expect(defaults.value).toBe(transaction.value)
    })
  })

  describe('gas price', () => {
    const noGasPrice = { ...transaction }
    delete noGasPrice.gasPrice

    it('is retrieved when not specified', async () => {
      expect.assertions(2)
      provider.expectedResult('0x42').expectedPayload({ method: 'eth_gasPrice' })
      const defaults = await transactionDefaults.apply(noGasPrice)
      expect(defaults.gasPrice).toBe('0x42')
    })

    it('is unchanged when defined', async () => {
      expect.assertions(1)
      const defaults = await transactionDefaults.apply(transaction)
      expect(defaults.gasPrice).toEqual(transaction.gasPrice)
    })

    it('throws when gas price cannot be determined', async () => {
      expect.assertions(2)
      provider.setReject(true).expectedPayload({ method: 'eth_gasPrice' })
      await expect(transactionDefaults.apply(noGasPrice)).rejects.toThrow('an error')
    })
  })

  describe('gas limit', () => {
    const noGas = { ...transaction }
    delete noGas.gas

    const expectedRequest = {
      method: 'eth_estimateGas',
      params: [noGas]
    }

    it('estimates the gas limit when not specified', async () => {
      expect.assertions(2)
      provider.expectedResult('0x42').expectedPayload(expectedRequest)
      const defaults = await transactionDefaults.apply(noGas)
      expect(defaults.gas).toBe('0x42')
    })

    it('is unchanged when defined', async () => {
      expect.assertions(1)
      const defaults = await transactionDefaults.apply(transaction)
      expect(defaults.gas).toBe(transaction.gas)
    })

    it('throws when gas limit cannot be estimated', async () => {
      expect.assertions(2)
      provider.setReject(true).expectedPayload(expectedRequest)
      await expect(transactionDefaults.apply(noGas)).rejects.toThrow('an error')
    })
  })

  describe('chain id', () => {
    const noChainId = { ...transaction }
    delete noChainId.chainId

    const expectedRequest = { method: 'net_version' }

    it('is retrieved when not specified', async () => {
      expect.assertions(2)
      provider.expectedResult('42').expectedPayload(expectedRequest)
      const defaults = await transactionDefaults.apply(noChainId)
      expect(defaults.chainId).toBe(42)
    })

    it('is unchanged when defined', async () => {
      expect.assertions(1)
      const defaults = await transactionDefaults.apply(transaction)
      expect(defaults.chainId).toBe(transaction.chainId)
    })

    it('throws when chain id could not be retrieved', async () => {
      expect.assertions(2)
      provider.setReject(true).expectedPayload(expectedRequest)
      await expect(transactionDefaults.apply(noChainId)).rejects.toThrow('an error')
    })
  })
})
