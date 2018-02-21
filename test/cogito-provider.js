const expect = require('chai').expect
const td = require('testdouble')
const anything = td.matchers.anything
const { stubResponse } = require('./provider-stubbing')
const Web3 = require('web3')
const CogitoProvider = require('../lib/cogito-provider')

describe('provider', function () {
  let cogitoProvider
  let originalProvider
  let web3

  beforeEach(function () {
    originalProvider = td.object()
    cogitoProvider = new CogitoProvider({ originalProvider })
    web3 = new Web3(cogitoProvider)
  })

  it('passes requests to the original provider', function (done) {
    stubResponse(originalProvider, anything(), 42)
    web3.eth.getBlockNumber(function (_, result) {
      expect(result).to.equal(42)
      done()
    })
  })
})
