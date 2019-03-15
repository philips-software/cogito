import Web3 from 'web3'
import { Telepath } from '@cogitojs/telepath-js'
import { CogitoProvider } from '@cogitojs/cogito-web3-provider'
import { proxiesFromBlobs } from './proxiesFromBlobs'
import { getWeb3 } from './getWeb3'

class CogitoEthereum {
  contractBlobs
  telepath

  constructor (contractBlobs, queuingServiceUrl = 'https://telepath.cogito.mobi') {
    this.contractBlobs = contractBlobs
    this.telepath = new Telepath(queuingServiceUrl)
  }

  getCogitoWeb3 = async telepathChannel => {
    const web3 = await getWeb3()

    const cogitoProvider = new CogitoProvider({
      originalProvider: web3.currentProvider,
      telepathChannel
    })

    return new Web3(cogitoProvider)
  }

  getTelepathChannel = async ({ channelId: id, channelKey: key, appName }) => {
    const channel = await this.telepath.createChannel({ id, key, appName })
    if (process.env.NODE_ENV !== 'test') {
      // don't do this in unit tests
      await channel.startNotifications()
    }
    return channel
  }

  getContext = async channelParams => {
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
