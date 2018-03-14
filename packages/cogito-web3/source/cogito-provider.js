import { AccountsProvider } from './accounts-provider'
import { TransactionsProvider } from './transactions-provider'

class CogitoProvider {
  constructor ({ originalProvider, telepathChannel }) {
    this.provider = originalProvider
    this.handlers = {
      'eth_accounts': new AccountsProvider({ telepathChannel }),
      'eth_sendTransaction': new TransactionsProvider({ originalProvider, telepathChannel })
    }
  }

  async send (payload, callback) {
    const handler = this.handlers[payload.method]
    try {
      if (handler) {
        callback(null, await handler.send(payload))
      } else {
        this.provider.send(payload, callback)
      }
    } catch (error) {
      callback(error, null)
    }
  }
}

export { CogitoProvider }
