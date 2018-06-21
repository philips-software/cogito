import express from 'express'
import cors from 'cors'
import Web3 from 'web3'
import EthereumTx from 'ethereumjs-tx'
import { TransactionNonces } from './transaction-nonces'

export default class FaucetServer {
  constructor (config) {
    this.queue = []
    this.config = config

    this.server = express()
    this.server.use(cors())
    this.server.post('/donate/:address', (req, res) => this.donateHandler(req, res))

    this.web3 = new Web3(config.providerUrl)
    this.web3.eth.defaultAccount = config.account
    this.nonces = new TransactionNonces({ web3: this.web3 })
  }

  donateHandler (request, response) {
    if (this.queue.length > 0) {
      // still processing previous request
      this.queue.push({request, response})
      return
    }

    this.queue.push({request, response})
    this.process()
  }

  async process () {
    while (this.queue.length > 0) {
      const { request, response } = this.queue[0]
      await this.donate(request, response)
      this.queue.shift()
    }
  }

  async donate (request, response) {
    try {
      const recipient = request.params.address
      const receipt = await this.sendDonateTransaction({ to: recipient })
      this.nonces.commitNonce(this.config.account, this.lastTransactionParams.nonce)
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
      gas: this.config.donationTxGas,
      nonce,
      chainId
    }
  }
}
