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

  get simpleStorageBlob () {
    return this.deployedJSON
  }

  get simpleStorage () {
    return this.simpleStorageProxy.deployed()
  }

  constructor ({ appName }) {
    this.appName = appName
    this.ganacheTestNetwork = new GanacheTestNetwork()
    this.injectWeb3()
  }

  deploy = async () => {
    const { deployedJSON } = await this.ganacheTestNetwork.deploy(SimpleStorage, { from: this.address })
    this.deployedJSON = deployedJSON
  }

  setupCogitoContext = async () => {
    const cogitoEthereum = new CogitoEthereum([ this.deployedJSON ])
    this.context = await cogitoEthereum.getContext({ appName: this.appName })

    this.ganacheTestNetwork.mockTelepathChannel(this.context.telepathChannel)
  }

  useTelepathChannel = telepathChannel => {
    this.ganacheTestNetwork.mockTelepathChannel(telepathChannel)
  }

  setup = async () => {
    await this.deploy()
    await this.setupCogitoContext()
  }
}

export { EthereumForSimpleStorage }
