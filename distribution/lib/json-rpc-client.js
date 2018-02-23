'use strict';

class JsonRpcClient {
  constructor({ provider }) {
    this.provider = provider;
    this.requestId = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER / 2));
  }

  async send(request) {
    request = Object.assign({ jsonrpc: '2.0', id: this.nextRequestId() }, request);
    const provider = this.provider;
    return new Promise(function (resolve, reject) {
      provider.send(request, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  nextRequestId() {
    return `cogito.${this.requestId++}`;
  }
}

module.exports = JsonRpcClient;