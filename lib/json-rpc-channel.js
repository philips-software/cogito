class JsonRpcChannel {
  constructor ({ channel }) {
    this.channel = channel
  }

  async send (request) {
    checkRequest(request)
    this.channel.send(JSON.stringify(request))
    let response
    do {
      response = parseResponse(await this.channel.receive())
      if (!response) {
        throw new Error('timeout waiting for JSON-RPC response')
      }
    } while (response.id !== request.id)
    return response
  }
}

function checkRequest (request) {
  if (request.jsonrpc !== '2.0') {
    throw new Error('request is not a JSON-RPC 2.0 object')
  }
  if (request.id === undefined) {
    throw new Error('JSON-RPC request is missing an "id" property')
  }
  if (request.method === undefined) {
    throw new Error('JSON-RPC request is missing a "method" property')
  }
}

function parseResponse (response) {
  try {
    return JSON.parse(response)
  } catch (error) {
    return response
  }
}

module.exports = JsonRpcChannel
