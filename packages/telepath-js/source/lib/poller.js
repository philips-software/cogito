import { delay } from './delay'

class Poller {
  constructor ({ pollFunction, retries = 10, interval = 100 }) {
    this.pollFunction = pollFunction
    this.retries = retries
    this.interval = interval
    this.waiting = []
    this.currentAttempt = 0
  }

  async poll () {
    const alreadyPolling = this.waiting.length > 0
    const expiry = this.currentAttempt + this.retries
    const promise = new Promise((resolve, reject) => {
      this.waiting.push({ resolve, reject, expiry })
    })
    if (!alreadyPolling) {
      this.attempt()
    }
    return promise
  }

  async attempt () {
    while (this.waiting[0] && this.waiting[0].expiry <= this.currentAttempt) {
      this.waiting.shift().resolve(null)
    }
    if (this.waiting.length === 0) {
      return
    }
    let result
    try {
      this.currentAttempt += 1
      result = await this.pollFunction()
    } catch (error) {
      this.waiting.shift().reject(error)
    }
    if (result) {
      this.waiting.shift().resolve(result)
    }
    await delay(this.interval)
    return this.attempt()
  }
}

export { Poller }
