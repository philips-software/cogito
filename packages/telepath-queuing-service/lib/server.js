import express from 'express'
import bodyParser from 'body-parser'
import { wrap } from 'async-middleware'
import cors from 'cors'

function createServer () {
  const server = express()
  let state = {}

  server.use(cors())
  server.use(bodyParser.text({ type: '*/*' }))

  server.post('/:queueId', wrap(async function (request, response) {
    const queueId = request.params.queueId
    const message = request.body
    if (!state[queueId]) {
      state[queueId] = []
    }
    state[queueId].push(message)
    response.status(200).end()
  }))

  server.get('/:queueId', wrap(async function (request, response) {
    const queueId = request.params.queueId
    const queue = state[queueId]
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
