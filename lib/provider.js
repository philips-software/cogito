class CogitoProvider {
  constructor ({ originalProvider, telepathChannel }) {
    this.provider = originalProvider
    this.channel = telepathChannel
  }

  send (payload, callback) {
    if (payload.method === 'eth_accounts') {
      this.getAccounts(payload, callback)
    } else if (payload.method === 'eth_sendTransaction') {
      this.sendTransaction(payload, callback)
    } else {
      this.provider.send(payload, callback)
    }
  }

  async getAccounts (payload, callback) {
    let error, result
    try {
      const request = { method: 'accounts', id: payload.id, jsonrpc: '2.0' }
      const response = await this.channel.send(request)
      result = { jsonrpc: '2.0', result: response.result, id: payload.id }
    } catch (e) {
      error = e
    }
    callback(error, result)
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

module.exports = CogitoProvider
