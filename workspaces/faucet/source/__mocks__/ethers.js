const { utils } = jest.requireActual('ethers')

class Wallet {
  constructor (privateKey, provider) {
    Wallet.lastPrivateKey = privateKey
    Wallet.lastProvider = provider
  }

  sendTransaction (transaction) {
    Wallet.lastTransaction = transaction
  }
}

class JsonRpcProvider {
  constructor (url) {
    this.url = url
  }
}

const providers = { JsonRpcProvider }

export { Wallet, providers, utils }
