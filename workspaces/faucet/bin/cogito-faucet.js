#!/usr/bin/env node
require('@babel/polyfill')
const program = require('commander')
const { FaucetServer } = require('@cogitojs/faucet')

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
  .option('--port <number>', 'Port number to listen on', '3001', parseInt)
  .parse(process.argv)

var faucetServer = new FaucetServer({
  providerUrl: program.provider,
  account: program.args[0],
  donationInEther: program.donation,
  privateKey: process.env.COGITO_FAUCET_PRIVATE_KEY
})

faucetServer.server.listen(program.port, function () {
  console.log(`Running on port ${program.port}`)
})
