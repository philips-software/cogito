class CogitoProvider {
  constructor ({ originalProvider, telepathChannel }) {
    this.provider = originalProvider
    this.channel = telepathChannel
  }

  sendAsync (payload, callback) {
    if (payload.method === 'eth_accounts') {
      this.getAccounts(payload, callback)
    } if (payload.method === 'eth_sendTransaction') {
      this.sendTransaction(payload, callback)
    } else {
      this.provider.sendAsync(payload, callback)
    }
  }

  async getAccounts (payload, callback) {
    const request = { method: 'accounts' }
    await this.channel.send(JSON.stringify(request))
    const response = JSON.parse(await this.channel.receive())
    callback(null, { jsonrpc: '2.0', result: response.result, id: payload.id })
  }

  async sendTransaction (payload, callback) {
    const request = { method: 'sign', params: [ payload.params[0] ] }
    await this.channel.send(JSON.stringify(request))
    const response = JSON.parse(await this.channel.receive())
    this.provider.sendAsync({
      jsonrpc: '2.0',
      id: payload.id,
      method: 'eth_sendRawTransaction',
      params: [ response.result ]
    }, callback)
  }
}

module.exports = CogitoProvider
