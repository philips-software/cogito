class Poller {
  constructor ({ pollFunction, retries = 10, interval = 100 }) {
    this.pollFunction = pollFunction
    this.retries = retries
    this.interval = interval
    this.waiting = []
  }

  async poll () {
    const promise = new Promise((resolve, reject) => {
      this.waiting.push({ resolve, reject })
    })
    this.attempt()
    return promise
  }

  async attempt (retries = this.retries) {
    if (retries === 0) {
      this.waiting.shift().resolve(null)
    }
    let result
    try {
      result = await this.pollFunction()
    } catch (error) {
      this.waiting.shift().reject(error)
      return
    }
    if (result) {
      this.waiting.shift().resolve(result)
    } else {
      await delay(this.interval)
      return this.attempt(retries - 1)
    }
  }
}

async function delay (milliseconds) {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(), milliseconds)
  })
}

module.exports = Poller
