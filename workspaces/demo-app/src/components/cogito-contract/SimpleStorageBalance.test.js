import React from 'react'
import { SimpleStorageMock } from 'test-helpers'
import { render, rerender, wait } from 'test-helpers/render-props'
import { createStore } from 'redux'
import { rootReducer } from 'app-state/rootReducer'

import { SimpleStorageBalance } from './SimpleStorageBalance'

jest.unmock('@react-frontend-developer/react-redux-render-prop')

describe('SimpleStorageBalance', () => {
  const value = 100
  let store
  let simpleStorage

  beforeEach(() => {
    simpleStorage = new SimpleStorageMock()
    store = createStore(rootReducer)
  })

  it('starts watching value changes after component is mounted', async () => {
    const { getByTestId } = render(<SimpleStorageBalance dispatch={store.dispatch} simpleStorage={simpleStorage} />, { store })
    expect(getByTestId(/current-value/i)).toHaveTextContent('0')
    simpleStorage.simulateValueChange(value)
    expect(getByTestId(/current-value/i)).toHaveTextContent(`${value}`)
  })

  it('restarts watching when contract instance changes', async () => {
    const { getByTestId, rerender: rerenderRtl } = render(<SimpleStorageBalance dispatch={store.dispatch} simpleStorage={simpleStorage} />, { store })
    expect(getByTestId(/current-value/i)).toHaveTextContent('0')
    simpleStorage.simulateValueChange(value)
    expect(getByTestId(/current-value/i)).toHaveTextContent(`${value}`)

    simpleStorage = new SimpleStorageMock()
    rerender(rerenderRtl, <SimpleStorageBalance dispatch={store.dispatch} simpleStorage={simpleStorage} />, store)
    expect(getByTestId(/current-value/i)).toHaveTextContent(`${value}`)
    simpleStorage.simulateValueChange(value + 10)
    expect(getByTestId(/current-value/i)).toHaveTextContent(`${value + 10}`)
  })

  it('stops watching value changes after component is unmounted', async () => {
    const { unmount, getByTestId } = render(<SimpleStorageBalance dispatch={store.dispatch} simpleStorage={simpleStorage} />, { store })
    simpleStorage.simulateValueChange(value)
    await wait(() => expect(getByTestId(/current-value/i)).toHaveTextContent(`${value}`))
    unmount()
    simpleStorage.simulateValueChange(value + 1)
    expect(store.getState().userData.balance).toBe(value)
  })
})
