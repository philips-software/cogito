import initContract from 'truffle-contract'

const proxiesFromBlobs = (blobs = [], web3) => {
  if (!web3) {
    return {}
  }
  return blobs.reduce((proxies, blob) => {
    const proxy = initContract(blob)
    proxy.setProvider(web3.currentProvider)
    proxies[blob.contractName] = proxy
    return proxies
  }, {})
}

export { proxiesFromBlobs }
