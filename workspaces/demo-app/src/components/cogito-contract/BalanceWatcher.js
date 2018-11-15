import React from 'react'
import { UserDataActions } from 'user-data'
import { ValueWatcher } from './ValueWatcher'

class BalanceWatcher extends React.Component {
  valueWatcher

  componentDidMount () {
    const { contracts, dispatch } = this.props
    this.valueWatcher = new ValueWatcher({
      contracts,
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
