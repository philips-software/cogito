import React, { Component } from 'react'

import { BalanceWatcher } from './BalanceWatcher'
import { Balance } from './Balance'

class SimpleStorageBalance extends Component {
  render () {
    const { dispatch, contractProxy } = this.props
    return (
      <>
        <BalanceWatcher contractProxy={contractProxy} dispatch={dispatch} />
        <Balance />
      </>
    )
  }
}

export { SimpleStorageBalance }
