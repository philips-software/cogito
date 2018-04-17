import { Telepath } from '@cogito/telepath-js'
import { CogitoProvider } from '@cogito/cogito-web3'
import Web3 from 'web3'
import { getWeb3 } from 'services/web3/getWeb3'
import { getDeployedContract } from 'services/web3/utils'

class CogitoWeb3 {
  telepath = new Telepath('https://telepath.cogito.mobi')
  web3
  channel
  deployedContract

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
    this.deployedContract = await getDeployedContract(this.web3)
  }

  update = async ({ channelId, channelKey }) => {
    try {
      await this.getCogitoWeb3({ channelId, channelKey })
      return {
        web3: this.web3,
        deployedContract: this.deployedContract,
        channel: this.channel
      }
    } catch (error) {
      alert(`Failed to load web3, channel, and deployedContract. Check console for details.`)
      console.log(error)
      return {}
    }
  }
}

export { CogitoWeb3 }
