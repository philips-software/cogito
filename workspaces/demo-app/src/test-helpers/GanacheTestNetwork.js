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
const maxAllowedListeners = 100

class GanacheTestNetwork {
  mnemonic =
    'hair snack volcano shift tragic wrong wreck release vibrant gossip ugly debate'
  username = 'Test Cogito User'
  wallet
  _web3
  _networkId
  secretKeys = [
    '0x795f9d5ad876fc9c28e5923146df0ec7040cd37740408d5d4069f291c3929e53',
    '0x37e28d130875cc704c5a622ab9a7fd83797f95a08faf62d375a7b2105b90f12c',
    '0x5790a99ea8462b5f0d96c3cd9f6c86d4912374bd6c070b2f8c7c8eb5866bf4d2',
    '0x5c34120d69e42a1d776c97d2a01ccaa1db0743cc1f2654bd6540be5d067e5c07',
    '0xcdb58f3a8b9dfa5d4138b3d3d2baec9f3753867455cd89f09784c4df468ccdc6',
    '0x7076dc9a0cba553c16514fced4bce18d499ecc0fee634c1e2230c69391f6cc9e',
    '0xaa6e960ca7b00e9e704a51caf23867eb84e8990b470d8de0a4f2c9dcfcf06d68',
    '0xf97a1a5a1f9152c7b9b1a4516900b2a3bc90d054ba7f370cd5872e7eb4e27e34',
    '0x99bdeb2078f1be1a69534db2fbf9cc62eaac814e1818953bcb3fbadca4f4f662',
    '0x65db7edd56ba5a798948b4f7c90bbf42cc455836557741de3305839fa5a7a2a6'
  ]

  constructor (networkId = Date.now()) {
    const provider = ganache.provider({
      mnemonic: this.mnemonic,
      network_id: networkId,
      accounts: this.secretKeys.map(secretKey => ({
        balance: '0x10000000000000000000',
        secretKey
      }))
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

  mockIdentityInfo = () => {
    return Promise.resolve({
      result: {
        ethereumAddress: this.wallet.address,
        username: this.username
      }
    })
  }

  mockTelepathChannel = telepathChannel => {
    telepathChannel.send = jest.fn().mockImplementation(request => {
      if (request.method === 'sign') {
        return this.mockSignRequest(request)
      } else if (request.method === 'accounts') {
        return this.mockAccountsRequest()
      } else if (request.method === 'getIdentityInfo') {
        return this.mockIdentityInfo()
      }
    })
  }

  updateContractJSON = (contractJSON, address, transactionHash) => {
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
    })
      .send({
        from,
        gas: 1000000,
        gasPrice: '10000000000000'
      })
      .on('transactionHash', hash => {
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
