import FaucetServer from './faucet-server'
import Web3 from 'web3'
import ganache from 'ganache-cli'
import request from 'supertest'

import { TransactionNonces } from './transaction-nonces'

describe('Server integration test', () => {
  const account1 = '0xdf562290eceb83d659e23252ae8d38fa0bbc06e8'

  let faucetServer

  beforeEach(() => {
    const configuration = {
      account: account1,
      privateKey: 'C87509A1C067BBDE78BEB793E6FA76530B6382A4C0241E5E4A9EC0A0F44DC0D3',
      donationInEther: '0.01'
    }
    faucetServer = new FaucetServer(configuration)

    const ganacheProvider = ganache.provider({
      accounts: [
        {
          balance: 100000000000000000000, // 100 ether
          secretKey: '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
        }
      ]
    })
    faucetServer.donator.web3 = new Web3(ganacheProvider)
    faucetServer.donator.web3.eth.defaultAccount = configuration.account
    faucetServer.donator.nonces = new TransactionNonces({
      web3: faucetServer.donator.web3
    })

    // suppress logging during integration test
    console.log = jest.fn()
  })

  it('transfers ether', async () => {
    jest.setTimeout(115000)
    const balanceBefore = await faucetServer.donator.web3.eth.getBalance(
      account1
    )

    await request(faucetServer.server).post(`/donate/${account1}`).expect(200)

    const balanceAfter = await faucetServer.donator.web3.eth.getBalance(
      account1
    )
    expect(parseInt(balanceAfter)).toBeGreaterThan(parseInt(balanceBefore))
  })
})
