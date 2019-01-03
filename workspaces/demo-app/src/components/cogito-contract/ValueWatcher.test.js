import { ValueWatcher } from './ValueWatcher'
import { EventWaiter, EthereumForSimpleStorage } from 'test-helpers'

describe('ValueWatcher', () => {
  let eventWaiter
  let simpleStorage
  let valueWatcher
  let hashes
  let ethereum

  const discriminator = (value, { transactionHash }) => {
    const discriminate = hashes[transactionHash]
    hashes[transactionHash] = true
    return discriminate === true
  }

  beforeEach(async () => {
    console.log = jest.fn()
    ethereum = await EthereumForSimpleStorage.setup()
    simpleStorage = await ethereum.simpleStorage
    hashes = {}
    eventWaiter = new EventWaiter({ discriminator })
    valueWatcher = new ValueWatcher({
      simpleStorage,
      onValueChanged: eventWaiter.onValueChanged
    })
  })

  afterEach(() => {
    valueWatcher.stop()
    console.log.mockRestore()
  })

  it('can observe value changing', async () => {
    valueWatcher.start()
    await simpleStorage.increase(5, { from: ethereum.address })

    const value = await simpleStorage.read()

    expect(await eventWaiter.wait()).toBe(value.toNumber())
  })

  it('does not watch before calling start', async () => {
    await simpleStorage.increase(5, { from: ethereum.address })

    await expect(eventWaiter.wait()).rejects.toThrow(new Error('timedout'))
  })

  it('observes successive value changes', async () => {
    valueWatcher.start()
    await simpleStorage.increase(5, { from: ethereum.address })

    let value = await simpleStorage.read()

    expect(await eventWaiter.wait()).toBe(value.toNumber())

    eventWaiter.reset()

    await simpleStorage.increase(5, { from: ethereum.address })

    value = await simpleStorage.read()

    expect(await eventWaiter.wait()).toBe(value.toNumber())
  })

  it('stops watching after calling stop', async () => {
    valueWatcher.start()
    await simpleStorage.increase(5, { from: ethereum.address })

    const value = await simpleStorage.read()

    expect(await eventWaiter.wait()).toBe(value.toNumber())

    valueWatcher.stop()
    eventWaiter.reset()

    await simpleStorage.increase(5, { from: ethereum.address })

    await expect(eventWaiter.wait()).rejects.toThrow(new Error('timedout'))
  })

  it('receives all the events since the beginning', async () => {
    valueWatcher.start()
    eventWaiter.expect(2)
    await simpleStorage.increase(5, { from: ethereum.address })
    const value1 = await simpleStorage.read()
    await simpleStorage.increase(5, { from: ethereum.address })
    const value2 = await simpleStorage.read()

    expect(await eventWaiter.wait()).toBe(value2.toNumber())
    expect(eventWaiter.intermediateValues).toEqual([value1.toNumber()])
  })
})
