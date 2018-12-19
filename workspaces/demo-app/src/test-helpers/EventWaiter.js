import { InteractivePromise } from './InteractivePromise'

class EventWaiter {
  expectedNumberOfEvents = 1
  intermediateValues = []
  interactivePromise
  discriminator

  constructor ({ discriminator } = {}) {
    this.interactivePromise = new InteractivePromise()
    this.discriminator = discriminator
  }

  reset () {
    this.interactivePromise = new InteractivePromise()
    this.expectedNumberOfEvents = 1
  }

  onValueChanged = (value, ...args) => {
    if (typeof this.discriminator === 'function' &&
        this.discriminator(value, ...args)) {
      return
    }
    if (--this.expectedNumberOfEvents === 0) {
      this.interactivePromise.resolve(value)
      clearTimeout(this.timeout)
    } else {
      this.intermediateValues = [ ...this.intermediateValues, value ]
    }
  }

  expect (expectedNumberOfEvents) {
    this.expectedNumberOfEvents = expectedNumberOfEvents
  }

  wait () {
    this.timeout = setTimeout(() => {
      this.interactivePromise.reject(new Error('timedout'))
    }, 4000)
    return this.interactivePromise.get()
  }
}

export { EventWaiter }
