import express from 'express'
import bodyParser from 'body-parser'
import { wrap } from 'async-middleware'
import cors from 'cors'
import Cache from 'lru-cache'

function createServer () {
  const server = express()
  let state = Cache({ maxAge: 10 * 60 * 1000 })

  server.use(cors())
  server.use(bodyParser.text({ type: '*/*' }))

  setInterval(() => { state.prune() }, 60 * 1000)

  server.post('/:queueId', wrap(async function (request, response) {
    const queueId = request.params.queueId
    const message = request.body
    if (!state.has(queueId)) {
      state.set(queueId, [])
    }
    const queue = state.get(queueId)
    if (queue.length < 3) {
      queue.push(message)
      response.status(200).end()
    } else {
      response
        .status(429)
        .send('Too many requests, maximum queue size reached.')
    }
  }))

  server.get('/:queueId', wrap(async function (request, response) {
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
  }))

  return server
}

export default createServer
