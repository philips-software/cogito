class JsonRpcChannel {
  constructor ({ channel }) {
    this.channel = channel
  }

  get id () {
    return this.channel.id
  }

  get key () {
    return this.channel.key
  }

  get appName () {
    return this.channel.appName
  }

  async send (request) {
    checkJsonRpcStructure(request, false)
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

  async startNotifications (notificationHandler) {
    await this.channel.startNotifications(message => {
      const notification = parseResponse(message)
      try {
        checkJsonRpcStructure(notification, true)
        notificationHandler(notification)
      } catch {
        // ditching invalid JSON-RPC notification
      }
    })
  }

  async notify (notification) {
    checkJsonRpcStructure(notification, true)
    this.channel.notify(JSON.stringify(notification))
  }

  createConnectUrl (baseUrl) {
    return this.channel.createConnectUrl(baseUrl)
  }
}

function checkJsonRpcStructure (structure, isNotification) {
  if (structure.jsonrpc !== '2.0') {
    throw new Error('request is not a JSON-RPC 2.0 object')
  }
  if (isNotification) {
    if (structure.id !== undefined) {
      throw new Error('JSON-RPC notification may not have an "id" property')
    }
  } else {
    if (structure.id === undefined) {
      throw new Error('JSON-RPC request is missing an "id" property')
    }
  }
  if (structure.method === undefined) {
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

export { JsonRpcChannel }
