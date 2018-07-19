import Web3 from 'web3'
import EthereumTx from 'ethereumjs-tx'
import { TransactionNonces } from './transaction-nonces'

class Donator {
  constructor (config) {
    this.config = config
    this.web3 = new Web3(config.providerUrl)
    this.web3.eth.defaultAccount = config.account
    this.nonces = new TransactionNonces({ web3: this.web3 })
  }

  async donate ({ to }) {
    const receipt = await this.sendDonateTransaction({ to })
    this.nonces.commitNonce(this.config.account, this.lastTransactionParams.nonce)
    console.log(`${new Date().toString()}: donated ${this.config.donationInEther} ether to ${to}`)
    return receipt
  }

  async sendDonateTransaction ({ to }) {
    const transaction = await this.createTransaction({ to })
    return this.sendTransaction({ transaction })
  }

  async createTransaction ({ to }) {
    const params = await this.createTransactionParameters({ to })
    this.lastTransactionParams = params
    const transaction = new EthereumTx(params)
    transaction.sign(Buffer.from(this.config.privateKey, 'hex'))
    return transaction
  }

  async sendTransaction ({ transaction }) {
    const serializedTransaction = transaction.serialize()
    return this.web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
  }

  async createTransactionParameters ({ to }) {
    const nonce = await this.nonces.getNonce(this.config.account)
    const chainId = await this.web3.eth.net.getId()
    return {
      to,
      value: this.web3.utils.toHex(this.web3.utils.toWei(this.config.donationInEther, 'ether')),
      gas: 21000,
      nonce,
      chainId
    }
  }
}

export { Donator }
