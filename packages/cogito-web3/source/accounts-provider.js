class AccountsProvider {
  constructor ({ telepathChannel }) {
    this.channel = telepathChannel
  }

  async send (payload, callback) {
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
}

export { AccountsProvider }
