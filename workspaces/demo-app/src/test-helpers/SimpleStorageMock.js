class SimpleStorageMock {
  static value = 5
  read = jest.fn().mockReturnValueOnce({
    toNumber: jest.fn().mockReturnValueOnce(SimpleStorageMock.value)
  }).mockReturnValueOnce({
    toNumber: jest.fn().mockReturnValueOnce(SimpleStorageMock.value + 1)
  })
  increase = jest.fn().mockResolvedValueOnce()
  watchEvent = callback => {
    this.emitEvent = callback
  }
  ValueChanged = jest.fn().mockReturnValue({
    watch: this.watchEvent,
    stopWatching: jest.fn(() => {
      this.emitEvent = null
    })
  })
  simulateValueChange (value) {
    this.emitEvent && this.emitEvent(null, {
      args: {
        value: { toNumber: () => value }
      }
    })
  }
  constructor ({ read, increase } = {}) {
    if (read) { this.read = read }
    if (increase) { this.increase = increase }
  }
}

export { SimpleStorageMock }
