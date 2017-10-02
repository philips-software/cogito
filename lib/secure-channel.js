class SecureChannel {
  constructor({ queuing, id }) {
    this.id = id
    this.queuing = queuing
  }

  send() {
    this.queuing.send(`${this.id}.red`)
  }
}

module.exports = { SecureChannel }
