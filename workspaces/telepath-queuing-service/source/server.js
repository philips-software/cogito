import express from 'express'
import bodyParser from 'body-parser'
import { wrap } from 'async-middleware'
import cors from 'cors'
import Cache from 'lru-cache'
import { MessageSender } from './message-sender'

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
  server.get(
    '/:queueId',
    wrap(async function (request, response) {
      const queueId = request.params.queueId
      const queue = state.get(queueId)
      state.set(queueId, queue) // retain queue in cache
      if (!queue) {
        response.status(204).end()
        return
      }
      const message = queue.shift()
      if (!message) {
        response.status(204).end()
        return
      }
      response.status(200).send(message)
    })
  )
}

export default createServer
