/* eslint-env mocha */
const expect = require('chai').expect
const td = require('testdouble')
const Poller = require('../lib/poller')

describe('Poller', function () {
  let poller
  let pollFunction

  beforeEach(function () {
    pollFunction = td.function()
    poller = new Poller({ pollFunction, interval: 0 })
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

  it('handles polls in the right order', async function () {
    td.when(pollFunction()).thenResolve(null, 1, null, 2)
    const poll1 = poller.poll()
    const poll2 = poller.poll()
    await expect(poll1).to.eventually.equal(1)
    await expect(poll2).to.eventually.equal(2)
  })

  it('has sensible defaults', function () {
    const poller = new Poller({ pollFunction })
    expect(poller.retries).to.equal(10)
    expect(poller.interval).to.equal(100)
  })
})
