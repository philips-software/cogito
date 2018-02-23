'use strict';

const JsonRpcClient = require('./json-rpc-client');

// Calculates transaction nonces. The main problem that this code attempts to
// solve is that the ethereum node does not take pending transactions into
// account when returning the transaction count, leading to duplicated
// transaction nonces when sending a new transaction while another is pending
// (see https://github.com/ethereum/go-ethereum/issues/2880).
// Our solution is to keep a local transaction count, and synchronize that with
// the node transaction count when appropriate
// (loosely based on https://github.com/livepeer/go-livepeer/pull/252).

class TransactionNonces {
  constructor({ provider }) {
    this.client = new JsonRpcClient({ provider });
    this.nonces = {};
  }

  async getNonce(transaction) {
    const remoteNonce = await this.getRemoteNonce(transaction);
    const localNonce = this.getLocalNonce(transaction);
    const nonce = Math.max(remoteNonce, localNonce);
    this.setLocalNonce(transaction, nonce + 1);
    return `0x${nonce.toString(16)}`;
  }

  async getRemoteNonce(transaction) {
    const request = {
      method: 'eth_getTransactionCount',
      params: [transaction.from, 'pending']
    };
    const nonceHex = (await this.client.send(request)).result;
    return parseInt(nonceHex.substr(2), 16);
  }

  getLocalNonce(transaction) {
    const nonce = this.nonces[transaction.from] || 0;
    this.nonces[transaction.from] = nonce + 1;
    return nonce;
  }

  setLocalNonce(transaction, nonce) {
    this.nonces[transaction.from] = nonce;
  }
}

module.exports = TransactionNonces;