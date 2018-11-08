export const maximumMessageLength = 100000
export const maximumQueueSize = 10

export class MessageSender {
  constructor ({ state }) {
    this.state = state
  }

  run ({ message, queueId }) {
    if (!this.verifyMessage({ message })) {
      return false
    }

    const queue = this.getQueue({ queueId })
    if (!this.verifyQueue({ queue })) {
      return undefined
    }

    queue.push(message)
    return true
  }

  verifyMessage ({ message }) {
    if (message.length > maximumMessageLength) {
      this.statusCode = 400
      this.error = `Message too large. Only ${maximumMessageLength} characters allowed.`
      return false
    }
    return true
  }

  getQueue ({ queueId }) {
    if (!this.state.get(queueId)) {
      this.state.set(queueId, [])
    }

    return this.state.get(queueId)
  }

  verifyQueue ({ queue }) {
    if (queue.length >= maximumQueueSize) {
      this.statusCode = 429
      this.error = 'Too many requests, maximum queue size reached.'
      return false
    }
    return true
  }
}
