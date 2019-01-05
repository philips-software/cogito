import { JsonRpcClient } from './json-rpc-client'

class TransactionDefaults {
  constructor ({ provider }) {
    this.client = new JsonRpcClient({ provider })
  }

  async apply (transaction) {
    return Object.assign({}, transaction, {
      value: transaction.value || '0x0',
      gasPrice: transaction.gasPrice || await this.getGasPrice(),
      gas: transaction.gas || await this.estimateGas(transaction),
      chainId: transaction.chainId || await this.getChainId()
    })
  }

  async getGasPrice () {
    const request = { method: 'eth_gasPrice' }
    return (await this.client.send(request)).result
  }

  async estimateGas (transaction) {
    const request = {
      method: 'eth_estimateGas',
      params: [ transaction ]
    }
    return (await this.client.send(request)).result
  }

  async getChainId () {
    const request = { method: 'net_version' }
    return parseInt((await this.client.send(request)).result)
  }
}

export { TransactionDefaults }
