class TransactionSender {
  constructor ({ originalProvider, telepathChannel }) {
    this.provider = originalProvider
    this.channel = telepathChannel
  }

  async sendTransaction (payload, callback) {
    try {
      const request = {
        method: 'sign',
        params: [ payload.params[0] ],
        id: payload.id,
        jsonrpc: '2.0'
      }
      const response = await this.channel.send(request)
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

module.exports = TransactionSender
