import { Donator } from './donator'
import { Wallet, utils } from 'ethers'

describe('donations', () => {
  const providerUrl = 'http://some.provider.url'
  const privateKey = 'some private key'
  const donationInEther = '0.001'
  const recipient = 'some recipient'

  beforeEach(() => {
    const donator = new Donator({ providerUrl, privateKey, donationInEther })
    donator.donate({ to: recipient })
  })

  it('uses the correct private key', () => {
    expect(Wallet.lastPrivateKey).toEqual(privateKey)
  })

  it('sends to the correct recipient', () => {
    expect(Wallet.lastTransaction.to).toEqual(recipient)
  })

  it('sends the correct amount', () => {
    const amount = Wallet.lastTransaction.value
    expect(amount).toEqual(utils.parseEther(donationInEther))
  })

  it('uses the correct provider url', () => {
    expect(Wallet.lastProvider.url).toEqual(providerUrl)
  })
})
