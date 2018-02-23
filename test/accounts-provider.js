const expect = require('chai').expect
const td = require('testdouble')
const anything = td.matchers.anything
const contains = td.matchers.contains
const Web3 = require('web3')
const CogitoProvider = require('../source/lib/cogito-provider')

describe('accounts', function () {
  const accounts = [
    '0x1234567890123456789012345678901234567890',
    '0x0123456789012345678901234567890123456789'
  ]

  let cogitoProvider
  let telepathChannel
  let web3

  beforeEach(function () {
    telepathChannel = td.object()
    cogitoProvider = new CogitoProvider({ telepathChannel })
    web3 = new Web3(cogitoProvider)
  })

  context('when cogito provides accounts', function () {
    beforeEach(function () {
      const request = { method: 'accounts' }
      const response = { result: accounts }
      td.when(telepathChannel.send(contains(request))).thenResolve(response)
    })

    it('returns the cogito accounts', function (done) {
      web3.eth.getAccounts(function (_, result) {
        expect(result).to.eql(accounts)
        done()
      })
    })
  })

  it('throws when requesting accounts via telepath fails', function (done) {
    td.when(telepathChannel.send(anything())).thenReject(new Error('an error'))
    web3.eth.getAccounts(function (error, _) {
      expect(error).to.not.be.null()
      done()
    })
  })
})
