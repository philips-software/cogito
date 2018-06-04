#!/usr/bin/env node

require('babel-polyfill')
var FaucetServer = require('@cogitojs/faucet').default
console.log('FaucetServer=', FaucetServer)
var fs = require('fs')

var environment = process.env.NODE_ENV || 'development'

var configurationFile = fs.readFileSync('faucet-config-' + environment + '.json', {encoding: 'utf-8'})
console.log('configurationFile=', configurationFile)
var configuration = JSON.parse(configurationFile)

var faucetServer = new FaucetServer(configuration)
faucetServer.server.listen(3001, function () {
  console.log(' running on port 3001')
})
