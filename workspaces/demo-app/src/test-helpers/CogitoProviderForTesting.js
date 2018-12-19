class CogitoProviderForTesting {
  constructor ({ originalCogitoProvider, redirectProvider }) {
    this.cogitoProvider = originalCogitoProvider
    this.redirectProvider = redirectProvider
  }
  send (payload, callback) {
    if (payload.method === 'eth_accounts' ||
        payload.method === 'eth_sendTransaction') {
      this.redirectProvider.send(payload, callback)
    } else {
      this.cogitoProvider.send(payload, callback)
    }
  }

  sendAsync () {
    this.send(...arguments)
  }
}

export { CogitoProviderForTesting }
