import Web3 from 'web3'
import ganache from 'ganache-cli'
import { ethers } from 'ethers'
import initContract from 'truffle-contract'

// this is caused by a ganache network - seems to be a bug
// we keep this number as low as possible - every time
// we have another test that uses Ganache
// we need to increase this number. If you do not, you
// will see a warning in the test output:
//
// MaxListenersExceededWarning: Possible EventEmitter memory
// leek detected. <N> data listeners added. Use
// emitter.setMaxListeners() to increase limit.
//
// We need to set that value of maxAllowedListeners to <N>.
// Alternatively set it to some big number like 100
const maxAllowedListeners = 29

class GanacheTestNetwork {
  mnemonic = 'hair snack volcano shift tragic wrong wreck release vibrant gossip ugly debate'
  wallet
  _web3
  _networkId

  constructor (networkId = Date.now()) {
    const provider = ganache.provider({
      mnemonic: this.mnemonic,
      network_id: networkId
    })
    this.wallet = ethers.Wallet.fromMnemonic(this.mnemonic)
    provider.setMaxListeners(maxAllowedListeners)
    this._web3 = new Web3(provider)
    this._networkId = networkId
  }

  get web3 () {
    return this._web3
  }

  getAccounts = async () => {
    this.accounts = await this.web3.eth.getAccounts()
    return this.accounts
  }

  makeTransactionEthersCompatible = transaction => {
    let ethersTransaction = {
      ...transaction,
      gasLimit: transaction.gas
    }
    delete ethersTransaction.from
    delete ethersTransaction.gas
    return ethersTransaction
  }

  mockSignRequest = async request => {
    const transaction = this.makeTransactionEthersCompatible(request.params[0])
    const signedTransaction = await this.wallet.sign(transaction)
    return Promise.resolve({
      result: signedTransaction
    })
  }

  mockAccountsRequest = () => {
    return Promise.resolve({
      result: [this.wallet.address]
    })
  }

  mockTelepathChannel = telepathChannel => {
    telepathChannel.send = jest.fn().mockImplementationOnce(request => {
      if (request.method === 'sign') {
        return this.mockSignRequest(request)
      } else if (request.method === 'accounts') {
        return this.mockAccountsRequest()
      }
    })
  }

  updateContractJSON = (
    contractJSON,
    address,
    transactionHash) => {
    const updatedContractJSON = {
      ...contractJSON,
      networks: {
        [this._networkId]: {
          events: {},
          links: {},
          address,
          transactionHash
        }
      }
    }
    return updatedContractJSON
  }

  deployContract = async (contractJSON, { from }) => {
    const Contract = new this.web3.eth.Contract([contractJSON])
    let transactionHash = ''
    const deployedContract = await Contract.deploy({
      data: contractJSON.bytecode
    }).send({
      from,
      gas: 1000000,
      gasPrice: '10000000000000'
    }).on('transactionHash', hash => {
      transactionHash = hash
    })
    return { deployedContract, transactionHash }
  }

  getContract = contractJSON => {
    const contract = initContract(contractJSON)
    contract.setProvider(this.web3.currentProvider)

    return contract
  }

  deploy = async (contractJSON, { from }) => {
    const { deployedContract, transactionHash } = await this.deployContract(
      contractJSON,
      { from }
    )
    const deployedJSON = this.updateContractJSON(
      contractJSON,
      deployedContract.options.address,
      transactionHash
    )
    const contract = this.getContract(deployedJSON)

    return {
      contract,
      deployedJSON
    }
  }
}

export { GanacheTestNetwork }
