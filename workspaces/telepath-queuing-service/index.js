import createServer from './source/server'

const server = createServer()

server.listen(3000, function () {
  console.log('Telepath Queueing Service running on port 3000')
})
