/* eslint-env mocha */
const expect = require('chai').expect
const td = require('testdouble')
const Poller = require('../lib/poller')

describe('Poller', function () {
  let poller
  let pollFunction

  beforeEach(function () {
    pollFunction = td.function()
    poller = new Poller({ pollFunction })
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
})
