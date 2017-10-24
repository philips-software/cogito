/* eslint-env mocha */
const expect = require('chai').expect
const td = require('testdouble')
const delay = require('../lib/delay')
const Poller = require('../lib/poller')

describe('Poller', function () {
  const retries = 5

  let poller
  let pollFunction

  beforeEach(function () {
    pollFunction = td.function()
    poller = new Poller({ pollFunction, retries, interval: 0 })
  })

  afterEach(function () {
    td.reset()
  })

  it('returns result', async function () {
    td.when(pollFunction()).thenResolve(42)
    await expect(poller.poll()).to.eventually.equal(42)
  })

  it('waits for result to become non-null', async function () {
    td.when(pollFunction()).thenResolve(null, 42)
    await expect(poller.poll()).to.eventually.equal(42)
  })

  it('returns null when result remains null', async function () {
    td.when(pollFunction()).thenResolve(null)
    await expect(poller.poll()).to.eventually.be.null()
  })

  it('stops polling after a number of retries', async function () {
    await poller.poll()
    td.verify(pollFunction(), { times: retries })
  })

  it('handles polls in the right order', async function () {
    td.when(pollFunction()).thenResolve(null, 1, null, 2)
    const poll1 = poller.poll()
    const poll2 = poller.poll()
    await expect(poll1).to.eventually.equal(1)
    await expect(poll2).to.eventually.equal(2)
  })

  it('does not invoke poll function concurrently', async function () {
    td.when(pollFunction()).thenDo(async function slow () {
      expect(slow.isRunning).to.not.be.true()
      slow.isRunning = true
      await delay(10)
      slow.isRunning = false
    })
    const poll1 = poller.poll()
    const poll2 = poller.poll()
    await poll1
    await poll2
  })

  it('throws when the poll function throws', async function () {
    td.when(pollFunction()).thenReject(new Error('an error'))
    await expect(poller.poll()).to.eventually.be.rejected()
  })

  it('recovers when the poll function throws', async function () {
    td.when(pollFunction(), { times: 1 }).thenReject()
    const poll1 = poller.poll()
    const poll2 = poller.poll()
    await expect(poll1).to.eventually.be.rejected()
    await expect(poll2).to.eventually.be.fulfilled()
  })

  it('has sensible defaults', function () {
    const poller = new Poller({ pollFunction })
    expect(poller.retries).to.equal(10)
    expect(poller.interval).to.equal(100)
  })
})
