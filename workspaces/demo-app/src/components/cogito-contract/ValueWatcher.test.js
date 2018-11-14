import { ValueWatcher } from './ValueWatcher'
import { EventWaiter, GanacheTestNetwork } from 'test-helpers'

import { SimpleStorage as simpleStorageDef } from '@cogitojs/demo-app-contracts'

describe('ValueWatcher', () => {
  let eventWaiter
  let simpleStorage
  let from
  let valueWatcher
  let ganacheTestNetwork

  beforeEach(async () => {
    ganacheTestNetwork = new GanacheTestNetwork()
    from = (await ganacheTestNetwork.getAccounts())[0]
    simpleStorage = await ganacheTestNetwork.deploy(simpleStorageDef, { from })
    eventWaiter = new EventWaiter()
    valueWatcher = new ValueWatcher({
      contracts: { simpleStorage },
      onValueChanged: eventWaiter.onValueChanged
    })
  })

  afterEach(() => {
    valueWatcher.stop()
  })

  it('can observe value changing', async () => {
    valueWatcher.start()
    await simpleStorage.increase(5, { from })

    const value = await simpleStorage.read()

    expect(await eventWaiter.wait()).toBe(value.toNumber())
  })

  it('does not watch before calling start', async () => {
    await simpleStorage.increase(5, { from })

    await expect(eventWaiter.wait()).rejects.toThrow(new Error('timedout'))
  })

  it('observes successive value changes', async () => {
    valueWatcher.start()
    await simpleStorage.increase(5, { from })

    let value = await simpleStorage.read()

    expect(await eventWaiter.wait()).toBe(value.toNumber())

    eventWaiter.reset()

    await simpleStorage.increase(5, { from })

    value = await simpleStorage.read()

    expect(await eventWaiter.wait()).toBe(value.toNumber())
  })

  it('stops watching after calling stop', async () => {
    valueWatcher.start()
    await simpleStorage.increase(5, { from })

    const value = await simpleStorage.read()

    expect(await eventWaiter.wait()).toBe(value.toNumber())

    valueWatcher.stop()
    eventWaiter.reset()

    await simpleStorage.increase(5, { from })

    await expect(eventWaiter.wait()).rejects.toThrow(new Error('timedout'))
  })

  it('receives all the events since the beginning', async () => {
    valueWatcher.start()
    eventWaiter.expect(2)
    await simpleStorage.increase(5, { from })
    const value1 = await simpleStorage.read()
    await simpleStorage.increase(5, { from })
    const value2 = await simpleStorage.read()

    expect(await eventWaiter.wait()).toBe(value2.toNumber())
    expect(eventWaiter.intermediateValues).toEqual([value1.toNumber()])
  })
})
