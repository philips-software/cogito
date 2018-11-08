export class MessageReceiver {
  constructor ({ state }) {
    this.state = state
  }

  run ({ queueId }) {
    const queue = this.state.get(queueId)
    this.state.set(queueId, queue) // retain queue in cache
    if (!queue) {
      return undefined
    }
    return queue.shift()
  }
}
