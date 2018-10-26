import Web3 from 'web3'

const getProviderURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_WEB3_PROVIDER_URL_PRODUCTION
  }

  return process.env.REACT_APP_WEB3_PROVIDER_URL || 'ws://localhost:8545'
}

const useLocalWeb3Provider = () => {
  const provider = new Web3.providers.WebsocketProvider(getProviderURL())
  return new Web3(provider)
}

const resolveWeb3 = (resolve) => {
  let { web3 } = window
  const alreadyInjected = typeof web3 !== 'undefined' // i.e. Mist/Metamask

  if (alreadyInjected) {
    console.log('Injected web3 detected.')
    web3 = new Web3(web3.currentProvider)
  } else {
    console.log('No web3 instance injected, using Local web3.')
    web3 = useLocalWeb3Provider()
  }

  resolve(web3)
}

const getWeb3 = () =>
  new Promise((resolve) => {
    if (process.env.REACT_APP_USE_INJECTED_WEB3 === 'YES') {
      console.log('will try to use injected web3 if possible')
      if (document.readyState === 'complete') {
        resolveWeb3(resolve)
      } else {
        window.addEventListener(`load`, () => {
          resolveWeb3(resolve)
        })
      }
    } else {
      console.log('will not use injected web3 even if it is there')
      resolve(useLocalWeb3Provider())
    }
  })

export { getWeb3 }
