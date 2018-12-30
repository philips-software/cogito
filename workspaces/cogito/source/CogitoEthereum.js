import Web3 from 'web3'
import { Telepath } from '@cogitojs/telepath-js'
import { CogitoProvider } from '@cogitojs/cogito-web3'
import { proxiesFromBlobs } from './proxiesFromBlobs'
import { getWeb3 } from './getWeb3'

class CogitoEthereum {
  contractBlobs
  telepath = new Telepath('https://telepath.cogito.mobi')

  constructor (contractBlobs) {
    this.contractBlobs = contractBlobs
  }

  getCogitoWeb3 = async telepathChannel => {
    const web3 = await getWeb3()

    const cogitoProvider = new CogitoProvider({
      originalProvider: web3.currentProvider,
      telepathChannel
    })

    return new Web3(cogitoProvider)
  }

  getTelepathChannel = ({ channelId: id, channelKey: key, appName }) => {
    return this.telepath.createChannel({ id, key, appName })
  }

  getContext = async (channelParams) => {
    const telepathChannel = await this.getTelepathChannel(channelParams)
    const cogitoWeb3 = await this.getCogitoWeb3(telepathChannel)
    const contractsProxies = proxiesFromBlobs(this.contractBlobs, cogitoWeb3)
    return {
      cogitoWeb3,
      contractsProxies,
      telepathChannel
    }
  }
}

export { CogitoEthereum }
