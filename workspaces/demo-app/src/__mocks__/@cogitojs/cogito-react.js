import React from 'react'

export class CogitoReact extends React.Component {
  state = {
    cogitoWeb3: {},
    telepathChannel: {
      id: 'telepathId',
      key: Uint8Array.from([1, 2, 3]),
      appName: 'Cogito Demo App'
    },
    contractsProxies: {
      SimpleStorage: 'SimpleStorageProxy'
    },
    newChannel: jest.fn()
  }

  render () {
    const { render, children } = this.props
    return render ? render(this.state) : children(this.state)
  }
}
