/* eslint-env mocha */
const expect = require('chai').expect
const SimpleStorage = artifacts.require('SimpleStorage.sol')

contract('SimpleStorage', function (accounts) {
  let simpleStorage

  beforeEach(async function () {
    simpleStorage = await SimpleStorage.new()
  })

  it('is deployed', async function () {
    expect(await SimpleStorage.deployed()).to.exist()
  })

  it('has zero by default', async function () {
    const amount = await simpleStorage.read()
    expect(amount.toNumber()).to.equal(0)
  })

  context('when adding one', function () {
    beforeEach(async function () {
      await simpleStorage.increase(1)
    })

    it('increases the value', async function () {
      const amount = await simpleStorage.read()
      expect(amount.toNumber()).to.equal(1)
    })
  })
})
