import initContract from 'truffle-contract'

class Contracts {
  web3

  constructor ({
    web3,
    contracts: {deployedContractsInfo, rawContractsInfo}
  }) {
    this.web3 = web3
    this.getDeployedContracts(deployedContractsInfo)
    this.getRawContracts(rawContractsInfo)
  }

  getDeployedContracts = contractsInfo => {
    contractsInfo.forEach(async contractInfo => {
      Object.assign(this, {
        [contractInfo.contractName]: await this.getDeployedContract(contractInfo.contractDefinition)
      })
    })
  }

  getRawContracts = contractsInfo => {
    contractsInfo.forEach(contractInfo => {
      Object.assign(this, {
        [contractInfo.contractName]: this.getRawContract(contractInfo.contractDefinition)
      })
    })
  }

  getDeployedContract = (contractDefinition) => {
    const rawContract = this.getRawContract(contractDefinition)
    return rawContract.deployed()
  }

  getRawContract = (contractDefinition) => {
    const contract = initContract(contractDefinition)
    contract.setProvider(this.web3.currentProvider)
    return this.fixContractForLocalhostTestrpc(contract)
  }

  // Dirty hack for web3@1.0.0 support for localhost testrpc
  // see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
  fixContractForLocalhostTestrpc = (contract) => {
    if (typeof contract.currentProvider.sendAsync !== 'function') {
      contract.currentProvider.sendAsync = function () {
        return contract.currentProvider.send.apply(
          contract.currentProvider, arguments
        )
      }
    }
    return contract
  }
}

export { Contracts }
