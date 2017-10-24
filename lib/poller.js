const delay = require('./delay')

class Poller {
  constructor ({ pollFunction, retries = 10, interval = 100 }) {
    this.pollFunction = pollFunction
    this.retries = retries
    this.interval = interval
    this.waiting = []
    this.currentAttempt = 0
  }

  async poll () {
    const expiry = this.currentAttempt + this.retries
    const promise = new Promise((resolve, reject) => {
      this.waiting.push({ resolve, reject, expiry })
    })
    this.attempt()
    return promise
  }

  async attempt () {
    while (this.waiting[0] && this.waiting[0].expiry <= this.currentAttempt) {
      this.waiting.shift().resolve(null)
      return
    }
    let result
    try {
      this.currentAttempt += 1
      result = await this.pollFunction()
    } catch (error) {
      this.waiting.shift().reject(error)
      return
    }
    if (result) {
      this.waiting.shift().resolve(result)
    } else {
      await delay(this.interval)
      return this.attempt()
    }
  }
}

module.exports = Poller
