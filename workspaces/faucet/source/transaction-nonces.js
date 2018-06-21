// Calculates transaction nonces. The main problem that this code attempts to
// solve is that the ethereum node does not take pending transactions into
// account when returning the transaction count, leading to duplicated
// transaction nonces when sending a new transaction while another is pending
// (see https://github.com/ethereum/go-ethereum/issues/2880).
// Our solution is to keep a local transaction count, and synchronize that with
// the node transaction count when appropriate
// (loosely based on https://github.com/livepeer/go-livepeer/pull/252).

class TransactionNonces {
  constructor ({ web3 }) {
    this.web3 = web3
    this.nonces = {}
  }

  async getNonce (account) {
    const localNonce = this.getLocalNonce(account)
    const remoteNonce = await this.getRemoteNonce(account)
    return Math.max(remoteNonce, localNonce)
  }

  commitNonce (account, nonce) {
    this.nonces[account] = nonce + 1
  }

  getLocalNonce (account) {
    const nonce = this.nonces[account] || 0
    return nonce
  }

  getRemoteNonce (account) {
    return this.web3.eth.getTransactionCount(account, 'pending')
  }
}

export { TransactionNonces }
