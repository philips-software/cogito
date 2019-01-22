import React from 'react'
import { UserDataActions } from 'user-data'
import { ValueWatcher } from './ValueWatcher'

class BalanceWatcher extends React.Component {
  valueWatcher

  async componentDidMount () {
    const { contractProxy, dispatch } = this.props
    const simpleStorage = await contractProxy.deployed()
    this.valueWatcher = new ValueWatcher({
      simpleStorage,
      onValueChanged: value => dispatch(UserDataActions.setBalance(value))
    })
    this.valueWatcher.start()
  }

  componentWillUnmount () {
    this.valueWatcher.stop()
  }

  render () {
    return null
  }
}

export { BalanceWatcher }
