import React, { Component } from 'react'

import { ValueWatcher } from './ValueWatcher'
import { Balance } from './Balance'

import { UserDataActions } from 'user-data'

class SimpleStorageBalance extends Component {
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
    return (
      <Balance />
    )
  }
}

export { SimpleStorageBalance }
