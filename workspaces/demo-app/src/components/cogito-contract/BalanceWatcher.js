import React from 'react'
import { UserDataActions } from 'user-data'
import { ValueWatcher } from './ValueWatcher'

class BalanceWatcher extends React.Component {
  valueWatcher

  componentDidMount () {
    const { simpleStorage, dispatch } = this.props
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
