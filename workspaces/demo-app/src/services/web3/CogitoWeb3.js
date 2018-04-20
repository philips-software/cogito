import Web3 from 'web3'
import { Telepath } from '@cogitojs/telepath-js'
import { CogitoProvider } from '@cogitojs/cogito-web3'
import { Contracts } from './Contracts'
import { getWeb3 } from 'services/web3/getWeb3'

class CogitoWeb3 {
  contractsInfo
  telepath = new Telepath('https://telepath.cogito.mobi')
  web3
  channel
  contracts

  constructor (contracts) {
    this.contractsInfo = contracts
  }

  getCogitoWeb3 = async ({ channelId, channelKey }) => {
    const web3 = await getWeb3()

    this.channel = await this.telepath.createChannel({
      id: channelId,
      key: channelKey
    })

    const cogitoProvider = new CogitoProvider({
      originalProvider: web3.currentProvider,
      telepathChannel: this.channel
    })

    this.web3 = new Web3(cogitoProvider)
  }

  update = async ({ channelId, channelKey }) => {
    try {
      await this.getCogitoWeb3({ channelId, channelKey })
      this.contracts = new Contracts({
        web3: this.web3,
        contracts: this.contractsInfo
      })
      return {
        web3: this.web3,
        contracts: this.contracts,
        channel: this.channel
      }
    } catch (error) {
      alert(`Failed to load web3, channel, and contracts. Check console for details.`)
      console.log(error)
      return {}
    }
  }
}

export { CogitoWeb3 }
