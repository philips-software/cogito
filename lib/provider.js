const Accounts = require('./provider-accounts')
const TransactionSender = require('./provider-transactions')

class CogitoProvider {
  constructor ({ originalProvider, telepathChannel }) {
    this.provider = originalProvider
    this.accounts = new Accounts({ telepathChannel })
    this.sender = new TransactionSender({ originalProvider, telepathChannel })
  }

  send (payload, callback) {
    if (payload.method === 'eth_accounts') {
      this.accounts.getAccounts(payload, callback)
    } else if (payload.method === 'eth_sendTransaction') {
      this.sender.sendTransaction(payload, callback)
    } else {
      this.provider.send(payload, callback)
    }
  }
}

module.exports = CogitoProvider
