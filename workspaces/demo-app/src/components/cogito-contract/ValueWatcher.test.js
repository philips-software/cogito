import { ValueWatcher } from './ValueWatcher'
import Web3 from 'web3'
import ganache from 'ganache-cli'
import initContract from 'truffle-contract'

import { SimpleStorage as simpleStorageDef } from '@cogitojs/demo-app-contracts'

const getWeb3 = () => {
  const mnemonic = 'hair snack volcano shift tragic wrong wreck release vibrant gossip ugly debate'
  const provider = ganache.provider({
    mnemonic
  })
  return new Web3(provider)
}

const getSenderAccount = async web3 => {
  const accounts = await web3.eth.getAccounts()
  return accounts[0]
}

const deployContract = async (web3, contractDefinition, from) => {
  const SimpleStorage = new web3.eth.Contract([contractDefinition])
  const d = await SimpleStorage.deploy({
    data: contractDefinition.bytecode
  }).send({
    from,
    gas: 1000000,
    gasPrice: '10000000000000'
  })
  const contract = initContract(contractDefinition)
  contract.setProvider(web3.currentProvider)

  return contract.at(d.options.address)
}

class EventWatcher {
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

describe('ValueWatcher', () => {
  let eventWatcher
  let simpleStorage
  let from
  let valueWatcher

  beforeEach(async () => {
    const web3 = getWeb3()
    from = await getSenderAccount(web3)
    simpleStorage = await deployContract(web3, simpleStorageDef, from)
    eventWatcher = new EventWatcher()
    valueWatcher = new ValueWatcher({
      web3,
      contracts: { simpleStorage },
      onValueChanged: eventWatcher.onValueChanged
    })
  })

  afterEach(() => {
    valueWatcher.stop()
  })

  it('can observe value changing', async () => {
    valueWatcher.start()
    await simpleStorage.increase(5, { from })

    const value = await simpleStorage.read({ from })

    expect(await eventWatcher.wait()).toBe(value.toNumber())
  })

  it('does not watch before calling start', async () => {
    await simpleStorage.increase(5, { from })

    await expect(eventWatcher.wait()).rejects.toThrow(new Error('timedout'))
  })

  it('observes successive value changes', async () => {
    valueWatcher.start()
    await simpleStorage.increase(5, { from })

    let value = await simpleStorage.read({ from })

    expect(await eventWatcher.wait()).toBe(value.toNumber())

    eventWatcher.reset()

    await simpleStorage.increase(5, { from })

    value = await simpleStorage.read({ from })

    expect(await eventWatcher.wait()).toBe(value.toNumber())
  })

  it('stops watching after calling stop', async () => {
    valueWatcher.start()
    await simpleStorage.increase(5, { from })

    const value = await simpleStorage.read({ from })

    expect(await eventWatcher.wait()).toBe(value.toNumber())

    valueWatcher.stop()
    eventWatcher.reset()

    await simpleStorage.increase(5, { from })

    await expect(eventWatcher.wait()).rejects.toThrow(new Error('timedout'))
  })

  it('receives all the events since the beginning', async () => {
    valueWatcher.start()
    eventWatcher.expect(2)
    await simpleStorage.increase(5, { from })
    const value1 = await simpleStorage.read({ from })
    await simpleStorage.increase(5, { from })
    const value2 = await simpleStorage.read({ from })

    expect(await eventWatcher.wait()).toBe(value2.toNumber())
    expect(eventWatcher.intermediateValues).toEqual([value1.toNumber()])
  })
})
