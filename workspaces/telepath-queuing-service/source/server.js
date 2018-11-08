import express from 'express'
import bodyParser from 'body-parser'
import { wrap } from 'async-middleware'
import cors from 'cors'
import Cache from 'lru-cache'
import { MessageSender } from './message-sender'
import { MessageReceiver } from './message-receiver'

function createServer () {
  const server = express()
  let state = Cache({ maxAge: 10 * 60 * 1000 })

  server.use(cors())
  server.use(bodyParser.text({ type: '*/*' }))

  setInterval(() => {
    state.prune()
  }, 60 * 1000)

  registerSendMessageEndpoint({ server, state })
  registerReadMessageEndpoint({ server, state })

  return server
}

function registerSendMessageEndpoint ({ server, state }) {
  const handleRequest = async (request, response) => {
    const sender = new MessageSender({ state })
    const queueId = request.params.queueId
    const message = request.body
    if (!sender.run({ message, queueId })) {
      response.status(sender.statusCode).send(sender.error)
    } else {
      response.status(200).end()
    }
  }

  server.post('/:queueId', wrap(handleRequest))
}

function registerReadMessageEndpoint ({ server, state }) {
  const handleRequest = async (request, response) => {
    const queueId = request.params.queueId
    const receiver = new MessageReceiver({ state })
    const message = receiver.run({ queueId })

    if (message) {
      response.status(200).send(message)
    } else {
      response.status(204).end()
    }
  }

  server.get('/:queueId', wrap(handleRequest))
}

export default createServer
