'use strict';

const Defaults = require('./transaction-defaults');

class TransactionsProvider {
  constructor({ originalProvider, telepathChannel }) {
    this.provider = originalProvider;
    this.channel = telepathChannel;
    this.defaults = new Defaults({ provider: originalProvider });
  }

  async send(payload, callback) {
    try {
      const transaction = await this.extractTransaction(payload);
      const signedTransaction = await this.sign(transaction, payload.id);
      const sendRequest = {
        jsonrpc: '2.0',
        id: payload.id,
        method: 'eth_sendRawTransaction',
        params: [signedTransaction]
      };
      this.provider.send(sendRequest, callback);
    } catch (error) {
      callback(error, null);
    }
  }

  async extractTransaction(payload) {
    const transaction = payload.params[0];
    return this.defaults.apply(transaction);
  }

  async sign(transaction, requestId) {
    const signRequest = {
      jsonrpc: '2.0',
      id: requestId,
      method: 'sign',
      params: [transaction]
    };
    const response = await this.channel.send(signRequest);
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.result;
  }
}

module.exports = TransactionsProvider;