#!/usr/bin/env node
require('babel-polyfill')
var program = require('commander')
var FaucetServer = require('@cogitojs/faucet').default
var fs = require('fs')

program
  .usage('[options] <account>')
  .description('start an Ethereum faucet that hands out Ether')
  .option(
    '-d --donation <ether>',
    'The amount (in Ether) that is donated for each request',
    '0.1'
  )
  .option(
    '-p --provider <url>',
    'URL of the Ethereum provider',
    'http://localhost:8545'
  )
  .parse(process.argv)

var faucetServer = new FaucetServer({
  providerUrl: program.providerUrl,
  account: program.args[0],
  donationInEther: program.donation,
  privateKey: process.env.COGITO_FAUCET_PRIVATE_KEY
})

faucetServer.server.listen(3001, function () {
  console.log('Running on port 3001')
})
