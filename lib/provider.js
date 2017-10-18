class CogitoProvider {
  constructor ({ originalProvider, telepathChannel }) {
    this.provider = originalProvider
    this.channel = telepathChannel
  }

  sendAsync (payload, callback) {
    if (payload.method === 'eth_accounts') {
      this.getAccounts(payload, callback)
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
}

module.exports = CogitoProvider
