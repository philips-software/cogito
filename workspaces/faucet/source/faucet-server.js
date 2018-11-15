import express from 'express'
import cors from 'cors'
import { Donator } from './donator'

export default class FaucetServer {
  constructor (config) {
    this.queue = []
    this.config = config
    this.donator = new Donator(config)

    this.server = express()
    this.server.use(cors())
    this.server.post('/donate/:address', (req, res) => this.donateHandler(req, res))
  }

  donateHandler (request, response) {
    request.setTimeout(600 * 1000) // 600 second timeout
    if (this.queue.length > 0) {
      // still processing previous request
      this.queue.push({ request, response })
      return
    }

    this.queue.push({ request, response })
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
      const receipt = await this.donator.donate({ to: recipient })
      response.status(200).send(JSON.stringify(receipt))
    } catch (error) {
      error.response = error.response || {}
      console.error(error)
      const message = `${error.message} - ${error.response.statusText || 'please check logs'}`
      response.status(500).send(message)
    }
  }
}
