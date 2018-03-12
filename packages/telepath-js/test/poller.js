/* eslint-env mocha */
// const expect = require('chai').expect
// const td = require('testdouble')
// const delay = require('../source/lib/delay')
// const Poller = require('../source/lib/poller')
import { Poller } from '../source/lib/poller'

describe('Poller', () => {
  const retries = 5

  let poller
  let pollFunction

  beforeEach(() => {
    pollFunction = jest.fn()
    poller = new Poller({ pollFunction, retries, interval: 0 })
  })

  it('returns result', async () => {
    pollFunction.mockReturnValue(Promise.resolve(42))

    const result = await poller.poll()

    expect(result).toBe(42)
  })

  it('waits for result to become non-null', async () => {
    pollFunction.mockReturnValueOnce(Promise.resolve(null)).mockReturnValueOnce(Promise.resolve(33))

    const result = await poller.poll()

    expect(result).toBe(33)
  })

  it('returns null when result remains null', async () => {
    pollFunction.mockReturnValueOnce(Promise.resolve(null))

    const result = await poller.poll()

    expect(result).toBe(null)
  })

  it('stops polling after a number of retries', async () => {
    await poller.poll()

    expect(pollFunction.mock.calls.length).toBe(retries)
  })

  it('handles polls in the right order', async () => {
    pollFunction.mockReturnValueOnce(Promise.resolve(null))
      .mockReturnValueOnce(Promise.resolve(1))
      .mockReturnValueOnce(Promise.resolve(null))
      .mockReturnValueOnce(Promise.resolve(2))

    const result1 = await poller.poll()
    const result2 = await poller.poll()

    expect(result1).toBe(1)
    expect(result2).toBe(2)
  })

  it('throws when the poll function throws', async () => {
    const error = new Error('an error')
    pollFunction.mockReturnValueOnce(Promise.reject(error))

    await expect(poller.poll()).rejects.toBe(error)
  })

  it('recovers when the poll function throws', async () => {
    const error = new Error('an error')
    pollFunction.mockReturnValueOnce(Promise.reject(error))
      .mockReturnValueOnce(Promise.resolve(11))

    await expect(poller.poll()).rejects.toBe(error)
    await expect(poller.poll()).resolves.toBe(11)
  })

  it('does not invoke poll function concurrently', async () => {
    pollFunction.mockReturnValueOnce(() => {

    })

    // td.when(pollFunction()).thenDo(async function slow () {
    //   expect(slow.isRunning).to.not.be.true()
    //   slow.isRunning = true
    //   await delay(1)
    //   slow.isRunning = false
    // })
    // const poll1 = poller.poll()
    // const poll2 = poller.poll()
    // await poll1
    // await poll2
  })

  it('has sensible defaults', () => {
    const poller = new Poller({ pollFunction })
    expect(poller.retries).toBe(10)
    expect(poller.interval).toBe(100)
  })
})
