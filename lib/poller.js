class Poller {
  constructor ({ pollFunction, retries = 10, interval = 100 }) {
    this.pollFunction = pollFunction
    this.retries = retries
    this.interval = interval
  }

  async poll (retries = this.retries) {
    if (retries === 0) {
      return null
    }
    const result = await this.pollFunction()
    if (result) {
      return result
    } else {
      await delay(this.interval)
      return this.poll(retries - 1)
    }
  }
}

async function delay (milliseconds) {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(), milliseconds)
  })
}

module.exports = Poller
