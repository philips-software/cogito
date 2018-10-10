const ganache = require('ganache-cli')

const mnemonic =
  'hair snack volcano shift tragic wrong wreck release vibrant gossip ugly debate'

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 0x2eefd8
    },
    testing: {
      network_id: '*',
      provider: ganache.provider({
        mnemonic
      }),
      gas: 4000000
    }
  },
  solc: {
    // Turns on the Solidity optimizer. For development the optimizer's
    // quite helpful, just remember to be careful, and potentially turn it
    // off, for live deployment and/or audit time. For more information,
    // see the Truffle 4.0.0 release notes.
    //
    // https://github.com/trufflesuite/truffle/releases/tag/v4.0.0
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
