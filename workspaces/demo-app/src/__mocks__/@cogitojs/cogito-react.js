import React from 'react'

const contract = {
  increase: (increment, obj) => {
    return new Promise(resolve => {
      resolve()
    })
  },
  read: obj => {
    return new Promise(resolve => {
      resolve({ toNumber: () => 15 })
    })
  }
}

const channel = {
  id: 'channelId',
  key: 'channelKey',
  createConnectUrl: jest.fn().mockReturnValue('connecturl')
}

export class CogitoReact extends React.Component {
  state = {
    web3: {
      eth: {
        personal: {
          unlockAccount: () => true
        }
      }
    },
    channel: channel,
    contracts: {
      simpleStorage: contract
    }
  }

  render () {
    return this.props.render(this.state)
  }
}
