const express = require('express')
const bodyParser = require('body-parser')

function createServer () {
  const server = express()
  let state = null

  server.use(bodyParser.text({ type: '*/*' }))

  server.post('/:queueId', async function (request, response) {
    const message = request.body
    state = message
    response.status(200).end()
  })

  server.get('/:queueId', async function (request, response) {
    const message = state
    response.status(200).send(message).end()
  })

  return server
}

module.exports = createServer
