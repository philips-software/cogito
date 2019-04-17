import { Wallet, providers, utils } from 'ethers'

class Donator {
  constructor ({ provider, providerUrl, privateKey, donationInEther }) {
    provider = provider || new providers.JsonRpcProvider(providerUrl)
    this.wallet = new Wallet(privateKey, provider)
    this.donation = utils.parseEther(donationInEther)
  }

  async donate ({ to }) {
    return this.wallet.sendTransaction({ to, value: this.donation })
  }
}

export { Donator }
