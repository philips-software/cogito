import express from 'express'
import bodyParser from 'body-parser'
import { wrap } from 'async-middleware'
import cors from 'cors'
import { createCache } from './auto-pruning-cache'
import { MessageSender } from './message-sender'
import { MessageReceiver } from './message-receiver'
import http from 'http'
import socketIO from 'socket.io'
import IOSocketServer from './socket-server'

let ioSocketServer

function createServer () {
  let state = createCache()

  const app = express()
  const httpServer = http.Server(app)
  const io = socketIO(httpServer)
  ioSocketServer = new IOSocketServer(io)
  ioSocketServer.start()

  app.use(cors())
  app.use(bodyParser.text({ type: '*/*' }))

  registerSendMessageEndpoint({ server: app, state })
  registerReadMessageEndpoint({ server: app, state })

  return httpServer
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
