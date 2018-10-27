class ValueWatcher {
  web3
  onValueChanged
  contracts

  constructor ({ web3, contracts, onValueChanged }) {
    this.web3 = web3
    this.contracts = contracts
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
    this.valueChangedEvents = this.contracts.simpleStorage.ValueChanged({}, options)
    this.startWatchingFor(this.valueChangedEvents)
  }

  startWatchingFor (events) {
    events.watch(async (error, result) => {
      if (!error) {
        const value = result.args.value.toNumber()

        this.onValueChanged(value)
      }
    })
  }
}

export { ValueWatcher }
