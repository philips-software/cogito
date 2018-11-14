class InteractivePromise {
  promise
  resolve
  reject
  constructor () {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
  resolve (value) {
    this.resolve(value)
  }
  reject (value) {
    this.reject(value)
  }
  get () {
    return this.promise
  }
}

export { InteractivePromise }
