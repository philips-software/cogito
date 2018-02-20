const Accounts = require('./provider-accounts')

class CogitoProvider {
  constructor ({ originalProvider, telepathChannel }) {
    this.provider = originalProvider
    this.channel = telepathChannel
    this.accounts = new Accounts({ telepathChannel })
  }

  send (payload, callback) {
    if (payload.method === 'eth_accounts') {
      this.accounts.getAccounts(payload, callback)
    } else if (payload.method === 'eth_sendTransaction') {
      this.sendTransaction(payload, callback)
    } else {
      this.provider.send(payload, callback)
    }
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
