import React from 'react'

const contract = {
  set: (balance, obj) => {
    return new Promise(resolve => {
      resolve()
    })
  },
  get: {
    call: obj => {
      return new Promise(resolve => {
        resolve({ toNumber: () => 15 })
      })
    }
  }
}

const channel = {
  id: 'channelId',
  key: 'channelKey',
  createConnectUrl: jest.fn().mockReturnValue('connecturl')
}

export class ReactWeb3 extends React.Component {
  state = {
    web3: {
      eth: {
        personal: {
          unlockAccount: () => true
        }
      }
    },
    channel: channel,
    deployedMarketplace: contract
  }

  render () {
    return this.props.render(this.state)
  }
}
