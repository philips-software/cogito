import deepFreeze from 'deep-freeze-es6'
import reducer from './reducer'
import { AppEventsActions } from './actions'

describe('app events', () => {
  it('has initial state', () => {
    expect(reducer(undefined, '')).toEqual({})
  })
})

describe('accounts fetching', () => {
  it('sets the account fetching in progress flag', () => {
    const state = deepFreeze({})
    const action = AppEventsActions.accountsFetchingInProgress()

    expect(reducer(state, action)).toEqual({
      accountsFetchingInProgress: true
    })
  })

  it('clears the account fetching in progress flag', () => {
    const state = deepFreeze({
      accountsFetchingInProgress: true
    })
    const action = AppEventsActions.accountsFetchingFulfilled()

    expect(reducer(state, action)).toEqual({
      accountsFetchingInProgress: false
    })
  })

  it('does not touch other events when setting', () => {
    const state = deepFreeze({
      evantA: false,
      evantB: true
    })
    const action = AppEventsActions.accountsFetchingInProgress()

    expect(reducer(state, action)).toMatchObject(state)
  })

  it('does not touch other events when clearing', () => {
    const state = deepFreeze({
      evantA: false,
      evantB: true
    })
    const action = AppEventsActions.accountsFetchingFulfilled()

    expect(reducer(state, action)).toMatchObject(state)
  })
})

describe('executing contracts', () => {
  it('sets the executing contract in progress flag', () => {
    const state = deepFreeze({})
    const action = AppEventsActions.executingContractInProgress()

    expect(reducer(state, action)).toEqual({
      executingContractInProgress: true
    })
  })

  it('clears the executing contract in progress flag', () => {
    const state = deepFreeze({
      executingContractInProgress: true
    })
    const action = AppEventsActions.executingContractFulfilled()

    expect(reducer(state, action)).toEqual({
      executingContractInProgress: false
    })
  })

  it('does not touch other events when setting', () => {
    const state = deepFreeze({
      evantA: false,
      evantB: true
    })
    const action = AppEventsActions.executingContractInProgress()

    expect(reducer(state, action)).toMatchObject(state)
  })

  it('does not touch other events when clearing', () => {
    const state = deepFreeze({
      evantA: false,
      evantB: true
    })
    const action = AppEventsActions.executingContractFulfilled()

    expect(reducer(state, action)).toMatchObject(state)
  })

  it('sets status to "error" on failure', () => {
    const state = deepFreeze({
      executingContractInProgress: true
    })
    const action = AppEventsActions.executingContractError()

    expect(reducer(state, action)).toEqual({
      executingContractInProgress: 'error'
    })
  })
})
