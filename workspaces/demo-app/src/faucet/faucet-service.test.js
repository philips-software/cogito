import nock from 'nock'
import { FaucetService } from './faucet-service'

describe('Faucet Service', () => {
  const baseUrl = 'https://faucet.example.com'
  const account = '0x2312314'

  let faucet

  beforeEach(() => {
    faucet = new FaucetService(baseUrl)
    console.log = jest.fn()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('can transfer funds to account', async () => {
    const post = nock(baseUrl).post(`/${account}`, '').reply(200)
    await faucet.transferFunds(account)
    expect(console.log.mock.calls[0][0]).toContain(`transfering funds to ${account}`)
    expect(post.isDone()).toBeTruthy()
  })

  it('throws when transfer fails', async () => {
    nock(baseUrl).post(`/${account}`, '').reply(500)
    await expect(faucet.transferFunds(account)).rejects.toThrow()
  })
})
