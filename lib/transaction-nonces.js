const JsonRpcClient = require('./json-rpc-client')

class TransactionNonces {
  constructor ({ provider }) {
    this.client = new JsonRpcClient({ provider })
    this.nonces = {}
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
}

module.exports = TransactionNonces
