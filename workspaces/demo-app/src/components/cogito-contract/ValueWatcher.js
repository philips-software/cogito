class ValueWatcher {
  onValueChanged
  simpleStorage

  constructor ({ simpleStorage, onValueChanged }) {
    this.simpleStorage = simpleStorage
    this.onValueChanged = onValueChanged
  }

  start () {
    let options = { fromBlock: 0, toBlock: 'latest' }
    this.watchValueChangedEvents(options)
  }

  stop (callback) {
    this.valueChangedEvents && this.valueChangedEvents.stopWatching(() => {
      callback && callback()
    })
  }

  watchValueChangedEvents (options) {
    this.valueChangedEvents = this.simpleStorage.ValueChanged({}, options)
    this.startWatchingFor(this.valueChangedEvents)
  }

  startWatchingFor (events) {
    events.watch((error, result) => {
      if (!error) {
        const value = result.args.value.toNumber()

        this.onValueChanged && this.onValueChanged(value, result)
      }
    })
  }
}

export { ValueWatcher }
