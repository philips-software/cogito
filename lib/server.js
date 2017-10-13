const express = require('express')
const bodyParser = require('body-parser')
const wrap = require('async-middleware').wrap

function createServer () {
  const server = express()
  let state = {}

  server.use(wrap(bodyParser.text({ type: '*/*' })))

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
      response.status(204).send()
      return
    }
    const message = queue.shift()
    if (!message) {
      response.status(204).send()
      return
    }
    response.status(200).send(message).end()
  }))

  return server
}

module.exports = createServer
