import initContract from 'truffle-contract'
import contractDefinition from 'contracts/SimpleStorage.json'

export const getAccounts = web3 =>
  new Promise((resolve, reject) => {
    web3.eth.getAccounts(
      (error, accounts) => (error ? reject(error) : resolve(accounts))
    )
  })

export const getDeployedContract = async web3 => {
  const contract = initContract(contractDefinition)
  contract.setProvider(web3.currentProvider)
  const fixedContract = fixContractForLocalhostTestrpc(contract)
  const instance = await fixedContract.deployed()
  return instance
}

// Dirty hack for web3@1.0.0 support for localhost testrpc
// see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
function fixContractForLocalhostTestrpc (contract) {
  if (typeof contract.currentProvider.sendAsync !== 'function') {
    contract.currentProvider.sendAsync = function () {
      return contract.currentProvider.send.apply(
        contract.currentProvider, arguments
      )
    }
  }
  return contract
}
