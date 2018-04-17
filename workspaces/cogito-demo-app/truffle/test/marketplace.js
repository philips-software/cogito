/* eslint-env mocha */
const expect = require('chai').expect
const Marketplace = artifacts.require('Marketplace.sol')
const License = artifacts.require('License.sol')

contract('Marketplace', function (accounts) {
  let marketplace

  beforeEach(async function () {
    marketplace = await Marketplace.new()
  })

  it('is deployed', async function () {
    expect(await Marketplace.deployed()).to.exist()
  })

  it('has zero licenses by default', async function () {
    const amount = await marketplace.numberOfLicenses()
    expect(amount.toNumber()).to.equal(0)
  })

  context('when requesting a license', function () {
    const product = 'a product'
    const price = 5000
    const supplier = 'Peter'
    const licensee = accounts[1]

    let requestTx

    beforeEach(async function () {
      await marketplace.requestLicense('dummy', 1, 'dummy', { from: accounts[0] })
      requestTx = await marketplace.requestLicense(product, price, supplier, { from: licensee })
    })

    it('increases the number of licenses', async function () {
      const amount = await marketplace.numberOfLicenses()
      expect(amount.toNumber()).to.equal(2)
    })

    context('given the requested license', function () {
      let license

      beforeEach(async function () {
        const licenseAddress = await marketplace.getLicense(1)
        license = await License.at(licenseAddress)
      })

      it('has been announced in an event', async function () {
        const event = requestTx.logs[0]
        expect(event.event).to.equal('DidRequestLicense')
        expect(event.args.license).to.equal(license.address)
      })

      it('stores its index in the list', async function () {
        const index = await license.index()
        expect(index.toNumber()).to.equal(1)
      })

      it('stores the requested product', async function () {
        expect(await license.product()).to.equal(product)
      })

      it('stores the price', async function () {
        const licensePrice = await license.price()
        expect(licensePrice.toNumber()).to.equal(price)
      })

      it('stores the supplier', async function () {
        expect(await license.supplier()).to.equal(supplier)
      })

      it('stores the licensee', async function () {
        expect(await license.licensee()).to.equal(licensee)
      })

      it('is unpaid by default', async function () {
        expect(await license.isPaid()).to.be.false()
      })

      context('when paying the license', async function () {
        let payTx

        beforeEach(async function () {
          payTx = await marketplace.payLicense(1)
        })

        it('is marked as paid', async function () {
          expect(await license.isPaid()).to.be.true()
        })

        it('is emitted as an event', async function () {
          const event = payTx.logs[0]
          expect(event.event).to.equal('DidPayLicense')
          expect(event.args.license).to.equal(license.address)
        })
      })
    })
  })
})
