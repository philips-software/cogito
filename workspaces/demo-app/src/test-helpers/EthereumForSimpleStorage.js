import { SimpleStorage } from '@cogitojs/demo-app-contracts'
import { CogitoEthereum } from '@cogitojs/cogito'
import { GanacheTestNetwork } from './GanacheTestNetwork'

const appName = 'Cogito Demo App'

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

  static setup = async (contractsBlobs = [ SimpleStorage ]) => {
    const ethereum = new EthereumForSimpleStorage({ appName })
    await ethereum.setup(contractsBlobs)
    return ethereum
  }

  constructor ({ appName }) {
    this.appName = appName
    this.ganacheTestNetwork = new GanacheTestNetwork()
    this.injectWeb3()
  }

  deploy = async (contractsBlobs) => {
    const deployments = await Promise.all(contractsBlobs.map(blob =>
      this.ganacheTestNetwork.deploy(blob, { from: this.address })
    ))
    const { deployedJSON } = deployments[0]
    this.deployedJSON = deployedJSON
    this.deployedJSONs = deployments.map(d => d.deployedJSON)
  }

  setupCogitoContext = async () => {
    const cogitoEthereum = new CogitoEthereum(this.deployedJSONs)
    this.context = await cogitoEthereum.getContext({ appName: this.appName })

    this.ganacheTestNetwork.mockTelepathChannel(this.context.telepathChannel)
  }

  useTelepathChannel = telepathChannel => {
    this.ganacheTestNetwork.mockTelepathChannel(telepathChannel)
  }

  setup = async (contractsBlobs = [ SimpleStorage ]) => {
    await this.deploy(contractsBlobs)
    await this.setupCogitoContext()
  }
}

export { EthereumForSimpleStorage }
