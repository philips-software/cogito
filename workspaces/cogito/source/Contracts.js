import initContract from 'truffle-contract'

class Contracts {
  web3

  constructor ({
    web3,
    contracts: { deployedContractsInfo, rawContractsInfo }
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
    return contract
  }
}

export { Contracts }
