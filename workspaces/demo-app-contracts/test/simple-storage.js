/* eslint-env mocha */
const expect = require('chai').expect
const SimpleStorage = artifacts.require('SimpleStorage.sol')

contract('SimpleStorage', function (accounts) {
  let simpleStorage
  const requester = accounts[1]

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

  it('can be reset', async function () {
    await simpleStorage.increase(5, { from: requester })
    let amount = await simpleStorage.read()
    expect(amount.toNumber()).to.equal(5)
    await simpleStorage.reset({ from: requester })
    amount = await simpleStorage.read()
    expect(amount.toNumber()).to.equal(0)
  })

  context('when increasing by one', function () {
    let transaction
    beforeEach(async function () {
      transaction = await simpleStorage.increase(1, { from: requester })
    })

    it('increases the value', async function () {
      const amount = await simpleStorage.read()
      expect(amount.toNumber()).to.equal(1)
    })

    describe('emitting event', function () {
      let event

      beforeEach(function () {
        event = transaction.logs[0]
      })

      it('contains the address of the contract', function () {
        const contractAddress = event.args.simpleStorage
        expect(contractAddress).to.equal(simpleStorage.address)
      })

      it('contains the sender of the increase operation', function () {
        const sender = event.args.sender
        expect(sender).to.equal(requester)
      })

      it('contains the current contract value', async function () {
        const value = event.args.value
        const amount = await simpleStorage.read()
        expect(value.toNumber()).to.equal(amount.toNumber())
      })
    })
  })
})
