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
    this.subscriptions = []
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

  subscribeForNotifications (onNotification, onError) {
    this.subscriptions.push({ onNotification, onError })
    return this.subscriptions.length - 1
  }

  unsubscribeForNotifications (subscription) {
    this.subscriptions[subscription] = null
  }

  fakeIncomingNotification (notification) {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.onNotification(notification)
      }
    })
  }

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
