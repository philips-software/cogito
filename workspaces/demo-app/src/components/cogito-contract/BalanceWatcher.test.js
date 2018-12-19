import React from 'react'
import { SimpleStorageMock } from 'test-helpers'
import { render } from 'react-testing-library'
import { createStore } from 'redux'
import { rootReducer } from 'app-state/rootReducer'

import { BalanceWatcher } from './BalanceWatcher'

describe('BalanceWatcher', () => {
  const value = 100
  let store
  let simpleStorage

  beforeEach(() => {
    simpleStorage = new SimpleStorageMock()
    store = createStore(rootReducer)
  })

  it('starts watching value changes after component is mounted', () => {
    render(<BalanceWatcher dispatch={store.dispatch} simpleStorage={simpleStorage} />)
    expect(store.getState().userData.balance).toBe(0)
    simpleStorage.simulateValueChange(value)
    expect(store.getState().userData.balance).toBe(value)
  })

  it('stops watching value changes after component is unmounted', () => {
    const { unmount } = render(<BalanceWatcher dispatch={store.dispatch} simpleStorage={simpleStorage} />)
    unmount()
    simpleStorage.simulateValueChange(value)
    expect(store.getState().userData.balance).toBe(0)
  })
})
