const expect = require('chai').expect
const td = require('testdouble')
const contains = td.matchers.contains
const { stubResponse, stubResponseError } = require('./provider-stubbing')
const TransactionDefaults = require('../lib/transaction-defaults')

describe('transaction defaults', function () {
  const transaction = {
    from: '0x1234567890123456789012345678901234567890',
    value: 10,
    gasPrice: 20,
    nonce: 30,
    gas: 40
  }

  let transactionDefaults
  let provider

  beforeEach(function () {
    provider = td.object()
    transactionDefaults = new TransactionDefaults({ provider })
  })

  describe('value', function () {
    const noValue = { ...transaction }
    delete noValue.value

    it('is 0 when not defined', async function () {
      const defaults = await transactionDefaults.apply(noValue)
      expect(defaults.value).to.equal(0)
    })

    it('is unchanged when defined', async function () {
      const defaults = await transactionDefaults.apply(transaction)
      expect(defaults.value).to.equal(transaction.value)
    })
  })

  describe('gas price', function () {
    const noGasPrice = { ...transaction }
    delete noGasPrice.gasPrice

    it('is retrieved when not specified', async function () {
      stubResponse(provider, contains({ method: 'eth_gasPrice' }), 42)
      const defaults = await transactionDefaults.apply(noGasPrice)
      expect(defaults.gasPrice).to.equal(42)
    })

    it('is unchanged when defined', async function () {
      const defaults = await transactionDefaults.apply(transaction)
      expect(defaults.gasPrice).to.equal(transaction.gasPrice)
    })

    it('throws when gas price cannot be determined', async function () {
      stubResponseError(provider, contains({ method: 'eth_gasPrice' }))
      await expect(transactionDefaults.apply(noGasPrice)).to.be.rejected()
    })
  })

  describe('nonce', function () {
    const noNonce = { ...transaction }
    delete noNonce.nonce

    const expectedRequest = {
      method: 'eth_getTransactionCount',
      params: [ transaction.from, 'pending' ]
    }

    it('is equal to transaction count when not specified', async function () {
      stubResponse(provider, contains(expectedRequest), 42)
      const defaults = await transactionDefaults.apply(noNonce)
      expect(defaults.nonce).to.equal(42)
    })

    it('is unchanged when defined', async function () {
      const defaults = await transactionDefaults.apply(transaction)
      expect(defaults.nonce).to.equal(transaction.nonce)
    })

    it('throws when transaction count cannot be determined', async function () {
      stubResponseError(provider, contains(expectedRequest))
      await expect(transactionDefaults.apply(noNonce)).to.be.rejected()
    })
  })

  describe('gas limit', function () {
    const noGas = { ...transaction }
    delete noGas.gas

    const expectedRequest = {
      method: 'eth_estimateGas',
      params: [noGas]
    }

    it('estimates the gas limit when not specified', async function () {
      stubResponse(provider, contains(expectedRequest), 42)
      const defaults = await transactionDefaults.apply(noGas)
      expect(defaults.gas).to.equal(42)
    })

    it('is unchanged when defined', async function () {
      const defaults = await transactionDefaults.apply(transaction)
      expect(defaults.gas).to.equal(transaction.gas)
    })

    it('throws when gas limit cannot be estimated', async function () {
      stubResponseError(provider, contains(expectedRequest))
      await expect(transactionDefaults.apply(noGas)).to.be.rejected()
    })
  })
})
