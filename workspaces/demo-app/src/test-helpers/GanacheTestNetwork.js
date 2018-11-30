import Web3 from 'web3'
import ganache from 'ganache-cli'
import initContract from 'truffle-contract'

class GanacheTestNetwork {
  mnemonic = 'hair snack volcano shift tragic wrong wreck release vibrant gossip ugly debate'
  _web3

  constructor () {
    const provider = ganache.provider({
      mnemonic: this.mnemonic
    })
    provider.setMaxListeners(12)
    this._web3 = new Web3(provider)
  }

  get web3 () {
    return this._web3
  }

  getAccounts = async () => {
    this.accounts = await this.web3.eth.getAccounts()
    return this.accounts
  }

  deploy = async (contractDefinition, { from }) => {
    const SimpleStorage = new this.web3.eth.Contract([contractDefinition])
    const deployedContract = await SimpleStorage.deploy({
      data: contractDefinition.bytecode
    }).send({
      from,
      gas: 1000000,
      gasPrice: '10000000000000'
    })
    const contract = initContract(contractDefinition)
    contract.setProvider(this.web3.currentProvider)

    return contract.at(deployedContract.options.address)
  }
}

export { GanacheTestNetwork }
