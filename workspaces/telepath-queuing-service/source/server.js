import express from 'express'
import bodyParser from 'body-parser'
import { wrap } from 'async-middleware'
import cors from 'cors'
import Cache from 'lru-cache'

export const maximumMessageLength = 100000
export const maximumQueueSize = 10

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
  server.post(
    '/:queueId',
    wrap(async function (request, response) {
      const queueId = request.params.queueId
      const message = request.body
      if (message.length > maximumMessageLength) {
        response
          .status(400)
          .send(
            `Message too large. Only ${maximumMessageLength} characters allowed.`
          )
        return
      }
      if (!state.get(queueId)) {
        state.set(queueId, [])
      }
      const queue = state.get(queueId)
      if (queue.length >= maximumQueueSize) {
        response
          .status(429)
          .send('Too many requests, maximum queue size reached.')
        return
      }
      queue.push(message)
      response.status(200).end()
    })
  )
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
