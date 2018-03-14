class AccountsProvider {
  constructor ({ telepathChannel }) {
    this.channel = telepathChannel
  }

  async send (payload, callback) {
    const request = { method: 'accounts', id: payload.id, jsonrpc: '2.0' }
    const response = await this.channel.send(request)
    return { jsonrpc: '2.0', result: response.result, id: payload.id }
  }
}

export { AccountsProvider }
