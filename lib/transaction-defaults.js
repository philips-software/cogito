const JsonRpcClient = require('./json-rpc-client')

class TransactionDefaults {
  constructor ({ provider }) {
    this.client = new JsonRpcClient({ provider })
    this.nonces = {}
  }

  async apply (transaction) {
    return Object.assign({}, transaction, {
      value: transaction.value || '0x0',
      gasPrice: transaction.gasPrice || await this.getGasPrice(),
      nonce: transaction.nonce || await this.getNonce(transaction),
      gas: transaction.gas || await this.estimateGas(transaction),
      chainId: transaction.chainId || await this.getChainId()
    })
  }

  async getGasPrice () {
    const request = { method: 'eth_gasPrice' }
    return (await this.client.send(request)).result
  }

  async getNonce (transaction) {
    const remoteNonce = await this.getRemoteNonce(transaction)
    const localNonce = this.getLocalNonce(transaction)
    const nonce = Math.max(remoteNonce, localNonce)
    this.setLocalNonce(transaction, nonce + 1)
    return `0x${nonce.toString(16)}`
  }

  async getRemoteNonce (transaction) {
    const request = {
      method: 'eth_getTransactionCount',
      params: [ transaction.from, 'pending' ]
    }
    const nonceHex = (await this.client.send(request)).result
    return parseInt(nonceHex.substr(2), 16)
  }

  getLocalNonce (transaction) {
    const nonce = this.nonces[transaction.from] || 0
    this.nonces[transaction.from] = nonce + 1
    return nonce
  }

  setLocalNonce (transaction, nonce) {
    this.nonces[transaction.from] = nonce
  }

  async estimateGas (transaction) {
    const request = {
      method: 'eth_estimateGas',
      params: [ transaction ]
    }
    return (await this.client.send(request)).result
  }

  async getChainId () {
    const request = { method: 'net_version' }
    return parseInt((await this.client.send(request)).result)
  }
}

module.exports = TransactionDefaults
