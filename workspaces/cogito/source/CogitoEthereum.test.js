import { ethers } from 'ethers'
import { GanacheTestNetwork } from 'test-helpers'
import { SimpleStorage } from '@cogitojs/demo-app-contracts'
import { CogitoEthereum } from './'

describe('CogitoEthereum', () => {
  const exampleTelepathId = 'IDN3oO-6rGSyqpMFDC6EfCQC'
  const exampleTelepathKey = new Uint8Array([176, 8, 86, 89, 0, 33, 4, 124, 240, 249, 253, 251, 147, 56, 138, 54, 84, 144, 150, 125, 89, 4, 6, 6, 217, 246, 16, 163, 188, 247, 113, 134])
  const mnemonic = 'hair snack volcano shift tragic wrong wreck release vibrant gossip ugly debate'
  const blobs = [ SimpleStorage ]
  const appName = 'Cogito Demo App'
  let wallet

  beforeEach(() => {
    wallet = ethers.Wallet.fromMnemonic(mnemonic)
    console.log = jest.fn()
  })

  afterEach(() => {
    console.log.mockRestore()
  })

  const makeTransactionEthersCompatible = transaction => {
    let ethersTransaction = {
      ...transaction,
      gasLimit: transaction.gas
    }
    delete ethersTransaction.from
    delete ethersTransaction.gas
    return ethersTransaction
  }

  it('provides Web3 object with CogitoProvider', async () => {
    const cogitoEthereum = new CogitoEthereum(blobs)

    const { cogitoWeb3, telepathChannel } = await cogitoEthereum.getContext({ appName })

    telepathChannel.send = jest.fn().mockResolvedValueOnce({
      result: [wallet.address]
    })

    expect(await cogitoWeb3.eth.getAccounts()).toEqual([
      wallet.address
    ])
  })

  it('provides a new telepath channel when no channel id and key are provided', async () => {
    const cogitoEthereum = new CogitoEthereum(blobs)

    const { telepathChannel } = await cogitoEthereum.getContext({
      channelId: exampleTelepathId,
      channelKey: exampleTelepathKey,
      appName
    })

    expect(telepathChannel.id).toBe(exampleTelepathId)
    expect(telepathChannel.key).toEqual(exampleTelepathKey)
    expect(telepathChannel.appName).toBe(appName)
  })

  it('provides a telepath channel with provided channel id and key', async () => {
    const cogitoEthereum = new CogitoEthereum(blobs)

    const { telepathChannel } = await cogitoEthereum.getContext({ appName })

    expect(telepathChannel.id).toBeDefined()
    expect(telepathChannel.key).toBeDefined()
    expect(telepathChannel.appName).toBe(appName)
  })

  describe('when contracts are deployed', () => {
    const increment = 5
    let ganacheTestNetwork
    let cogitoEthereum

    const mockTelepathChannel = telepathChannel => {
      telepathChannel.send = jest.fn().mockImplementationOnce(async signRequest => {
        const transaction = makeTransactionEthersCompatible(signRequest.params[0])
        const signedTransaction = await wallet.sign(transaction)
        return Promise.resolve({
          result: signedTransaction
        })
      })
    }

    beforeEach(async () => {
      ganacheTestNetwork = new GanacheTestNetwork()
      window.web3 = ganacheTestNetwork.web3
      process.env.REACT_APP_USE_INJECTED_WEB3 = 'YES'
      const { deployedJSON } = await ganacheTestNetwork.deploy(SimpleStorage, { from: wallet.address })
      cogitoEthereum = new CogitoEthereum([deployedJSON])
    })

    it('can execute contract using provided proxy and cogito provider', async () => {
      const { contractsProxies, telepathChannel } = await cogitoEthereum.getContext({ appName })

      mockTelepathChannel(telepathChannel)

      const simpleStorage = await contractsProxies.SimpleStorage.deployed()
      await simpleStorage.increase(increment, { from: wallet.address })
      const value = (await simpleStorage.read()).toNumber()

      expect(value).toBe(5)
    })
  })
})
