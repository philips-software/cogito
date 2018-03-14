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
    return {
      ...transaction,
      nonce: transaction.nonce || await this.nonces.getNonce(transaction)
    }
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
    return new Promise((resolve, reject) => {
      provider.send(request, (error, result) => {
        error ? reject(error) : resolve(result)
      })
    })
  }
}

export { TransactionsProvider }
