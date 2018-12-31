import { SimpleStorage } from '@cogitojs/demo-app-contracts'
import { CogitoEthereum } from '@cogitojs/cogito'
import { GanacheTestNetwork } from './GanacheTestNetwork'

class EthereumForSimpleStorage {
  ganacheTestNetwork
  context

  injectWeb3 = () => {
    window.web3 = this.ganacheTestNetwork.web3
    process.env.REACT_APP_USE_INJECTED_WEB3 = 'YES'
  }

  get address () {
    return this.ganacheTestNetwork.wallet.address
  }

  get telepathChannel () {
    return this.context.telepathChannel
  }

  get cogitoWeb3 () {
    return this.context.cogitoWeb3
  }

  get simpleStorageProxy () {
    return this.context.contractsProxies.SimpleStorage
  }

  constructor ({ appName }) {
    this.appName = appName
    this.ganacheTestNetwork = new GanacheTestNetwork()
    this.injectWeb3()
  }

  deploy = () => {
    return this.ganacheTestNetwork.deploy(SimpleStorage, { from: this.address })
  }

  setupCogitoContext = async contractBlob => {
    const cogitoEthereum = new CogitoEthereum([ contractBlob ])
    this.context = await cogitoEthereum.getContext({ appName: this.appName })

    this.ganacheTestNetwork.mockTelepathChannel(this.context.telepathChannel)
  }

  setup = async () => {
    const { deployedJSON } = await this.deploy()
    await this.setupCogitoContext(deployedJSON)
  }
}

export { EthereumForSimpleStorage }
