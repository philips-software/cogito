#!/usr/bin/env node
require('babel-polyfill')
var program = require('commander')
var FaucetServer = require('@cogitojs/faucet').default
var fs = require('fs')

program
  .description('start an Ethereum faucet that hands out Ether')
  .option(
    '-p --provider <url>',
    'URL of the Ethereum provider',
    'http://localhost:8545'
  )
  .parse(process.argv)

var environment = process.env.NODE_ENV || 'development'

var configurationFile = fs.readFileSync('faucet-config-' + environment + '.json', {encoding: 'utf-8'})
var configuration = JSON.parse(configurationFile)
configuration.providerUrl = program.providerUrl

var faucetServer = new FaucetServer(configuration)
faucetServer.server.listen(3001, function () {
  console.log('Running on port 3001')
})
