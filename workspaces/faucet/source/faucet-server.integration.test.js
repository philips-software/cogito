import { FaucetServer } from './faucet-server'
import { providers } from 'ethers'
import ganache from 'ganache-cli'
import request from 'supertest'

jest.unmock('ethers')

describe('Server integration test', () => {
  const privateKey = 'C87509A1C067BBDE78BEB793E6FA76530B6382A4C0241E5E4A9EC0A0F44DC0D3'
  const account = '0xdf562290eceb83d659e23252ae8d38fa0bbc06e8'
  const donationInEther = '0.01'

  let faucetServer
  let provider

  beforeEach(() => {
    const ganacheProvider = ganache.provider({
      accounts: [
        {
          balance: 100000000000000000000, // 100 ether
          secretKey: `0x${privateKey}`
        }
      ]
    })
    provider = new providers.Web3Provider(ganacheProvider)
    faucetServer = new FaucetServer({ provider, privateKey, donationInEther })

    // suppress logging during integration test
    console.log = jest.fn()
  })

  it('transfers ether', async () => {
    const balanceBefore = await provider.getBalance(account)

    await request(faucetServer.server).post(`/donate/${account}`).expect(200)

    const balanceAfter = await provider.getBalance(account)
    expect(parseInt(balanceAfter)).toBeGreaterThan(parseInt(balanceBefore))
  })
})
