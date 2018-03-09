import { TransactionDefaults as Defaults } from './transaction-defaults'
import { TransactionNonces } from './transaction-nonces'

class TransactionsProvider {
  constructor ({ originalProvider, telepathChannel }) {
    this.provider = originalProvider
    this.channel = telepathChannel
    this.defaults = new Defaults({ provider: originalProvider })
    this.nonces = new TransactionNonces({ provider: originalProvider })
  }

  async send (payload, callback) {
    try {
      callback(null, await this.sendWithDefaults(payload))
    } catch (error) {
      callback(error, null)
    }
  }

  async sendWithDefaults (payload) {
    let transaction = payload.params[0]
    transaction = await this.setDefaults(transaction)
    transaction = await this.setNonce(transaction)
    const result = await this.sendTransaction(transaction, payload.id)
    if (!result.error) {
      this.nonces.commitNonce(transaction)
    }
    return result
  }

  async setDefaults (transaction) {
    return this.defaults.apply(transaction)
  }

  async setNonce (transaction) {
    return Object.assign({}, transaction, {
      nonce: transaction.nonce || await this.nonces.getNonce(transaction)
    })
  }

  async sendTransaction (transaction, requestId) {
    const signedTransaction = await this.sign(transaction, requestId)
    return this.sendRaw(signedTransaction, requestId)
  }

  async sign (transaction, requestId) {
    const signRequest = {
      jsonrpc: '2.0',
      id: requestId,
      method: 'sign',
      params: [ transaction ]
    }
    const response = await this.channel.send(signRequest)
    if (!response) {
      throw new Error('timeout while waiting for signature')
    }
    if (response.error) {
      throw new Error(response.error.message)
    }
    return response.result
  }

  async sendRaw (signedTransaction, requestId) {
    const provider = this.provider
    const request = {
      jsonrpc: '2.0',
      id: requestId,
      method: 'eth_sendRawTransaction',
      params: [ signedTransaction ]
    }
    return new Promise(function (resolve, reject) {
      provider.send(request, function (error, result) {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }
}

export { TransactionsProvider }
