class Poller {
  constructor ({ pollFunction }) {
    this.pollFunction = pollFunction
  }

  async poll (retries = 5) {
    if (retries === 0) {
      return null
    }
    const result = await this.pollFunction()
    if (result) {
      return result
    } else {
      await delay(100)
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
