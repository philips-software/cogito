import React, { Component } from 'react'

import { ValueWatcher } from './ValueWatcher'
import { Balance } from './Balance'

import { UserDataActions } from 'user-data'

class SimpleStorageBalance extends Component {
  valueWatcher

  watchSimpleStorageEvents = () => {
    const { simpleStorage, dispatch } = this.props
    this.valueWatcher = new ValueWatcher({
      simpleStorage,
      onValueChanged: value => dispatch(UserDataActions.setBalance(value))
    })
    this.valueWatcher.start()
  }

  componentDidMount () {
    this.watchSimpleStorageEvents()
  }

  componentDidUpdate (prevProps) {
    if (this.props.simpleStorage !== prevProps.simpleStorage) {
      if (this.valueWatcher) {
        this.valueWatcher.stop()
        this.watchSimpleStorageEvents()
      }
    }
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
