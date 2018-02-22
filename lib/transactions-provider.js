const Defaults = require('./transaction-defaults')

class TransactionsProvider {
  constructor ({ originalProvider, telepathChannel }) {
    this.provider = originalProvider
    this.channel = telepathChannel
    this.defaults = new Defaults({ provider: originalProvider })
  }

  async send (payload, callback) {
    try {
      let transaction = payload.params[0]
      transaction = await this.defaults.apply(transaction)
      const request = {
        method: 'sign',
        params: [ transaction ],
        id: payload.id,
        jsonrpc: '2.0'
      }
      const response = await this.channel.send(request)
      if (response.error) {
        throw new Error(response.error.message)
      }
      this.provider.send({
        jsonrpc: '2.0',
        id: payload.id,
        method: 'eth_sendRawTransaction',
        params: [ response.result ]
      }, callback)
    } catch (error) {
      callback(error, null)
    }
  }
}

module.exports = TransactionsProvider
