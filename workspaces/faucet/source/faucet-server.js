import express from 'express'
import cors from 'cors'
import Web3 from 'web3'
import EthereumTx from 'ethereumjs-tx'

export default class FaucetServer {
  constructor (config) {
    this.config = config

    this.server = express()
    this.server.use(cors())
    this.server.post('/donate/:address', this.donate.bind(this))

    this.web3 = new Web3(config.providerUrl)
    this.web3.eth.defaultAccount = config.account
  }

  async donate (request, response) {
    try {
      const recipient = request.params.address
      const receipt = await this.sendDonateTransaction({ to: recipient })
      console.log(`${new Date().toString()}: donated ${this.config.donationInEther} ether to ${recipient}`)
      response.status(200).send(JSON.stringify(receipt))
    } catch (error) {
      error.response = error.response || {}
      console.error(error)
      let message = `${error.message} - ${error.response.statusText || 'please check logs'}`
      response.status(500).send(message)
    }
  }

  async sendDonateTransaction ({ to }) {
    const transaction = await this.createTransaction({ to })
    return this.sendTransaction({ transaction })
  }

  async createTransaction ({ to }) {
    const params = await this.createTransactionParameters({ to })
    const transaction = new EthereumTx(params)
    transaction.sign(Buffer.from(this.config.privateKey, 'hex'))
    return transaction
  }

  async sendTransaction ({ transaction }) {
    const serializedTransaction = transaction.serialize()
    const transactionReceipt = this.web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
    return transactionReceipt
  }

  async createTransactionParameters ({ to }) {
    const nonce = await this.web3.eth.getTransactionCount(this.config.account)
    const chainId = await this.web3.eth.net.getId()
    return {
      to,
      value: this.web3.utils.toHex(this.web3.utils.toWei(this.config.donationInEther, 'ether')),
      gas: this.config.donationTxGas,
      nonce,
      chainId
    }
  }
}
