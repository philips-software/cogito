#!/usr/bin/env node

require('babel-polyfill')
var FaucetServer = require('@cogitojs/faucet').default
var fs = require('fs')

var environment = process.env.NODE_ENV || 'development'
var providerUrl = process.env.PROVIDER_URL

var configurationFile = fs.readFileSync('faucet-config-' + environment + '.json', {encoding: 'utf-8'})
var configuration = JSON.parse(configurationFile)

if (providerUrl) {
  configuration.providerUrl = providerUrl
}

console.log('Using configuration:')
console.log(configuration)

var faucetServer = new FaucetServer(configuration)
faucetServer.server.listen(3001, function () {
  console.log('Running on port 3001')
})
