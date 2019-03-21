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

var nextKey = 1

class JsonRpcChannel {
  constructor ({ channel }) {
    this.channel = channel
  }

  createConnectUrl () {
    return 'connectUrl'
  }

  get id () {
    return this.channel.id || Date.now().toString()
  }

  get key () {
    return this.channel.key || Uint8Array.of(nextKey++)
  }

  get appName () {
    return this.channel.appName
  }

  startNotifications () {}
  subscribeForNotifications () {}
  unsubscribeForNotifications () {}

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
