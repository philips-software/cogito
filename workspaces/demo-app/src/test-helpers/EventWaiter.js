class EventWaiter {
  promise
  promiseResolve
  promiseReject
  expectedNumberOfEvents = 1
  intermediateValues = []

  constructor () {
    this.promise = new Promise((resolve, reject) => {
      this.promiseResolve = resolve
      this.promiseReject = reject
    })
  }

  reset () {
    this.promise = new Promise((resolve, reject) => {
      this.promiseResolve = resolve
      this.promiseReject = reject
    })
    this.expectedNumberOfEvents = 1
  }

  onValueChanged = value => {
    if (--this.expectedNumberOfEvents === 0) {
      this.promiseResolve(value)
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
      this.promiseReject(new Error('timedout'))
    }, 4000)
    return this.promise
  }
}

export { EventWaiter }
