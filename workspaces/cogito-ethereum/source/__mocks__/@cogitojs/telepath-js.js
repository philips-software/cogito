class Telepath {
  constructor (serviceUrl) {
    this.serviceUrl = serviceUrl
  }

  async createChannel ({ id, key, appName }) {
    return new Promise(resolve => {
      const channel = new SecureChannel({ id, key, appName })
      resolve(new JsonRpcChannel({ channel }))
    })
  }
}

class JsonRpcChannel {
  constructor ({ channel }) {
    this.channel = channel
  }

  get id () {
    return this.channel.id || 'randomId'
  }

  get key () {
    return this.channel.key || 'randomKey'
  }

  get appName () {
    return this.channel.appName
  }

  startNotifications () {}

  async send (request) {
    this.sent = request
    return new Promise(resolve => {
      resolve(this.response)
    })
  }

  setMockedReceive (response) {
    this.response = response
  }
}

class SecureChannel {
  constructor ({ id, key, appName }) {
    this.id = id
    this.key = key
    this.appName = appName
  }
}

export { Telepath }
