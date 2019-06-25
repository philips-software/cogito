import { identityReducer, initialState } from './reducer'
import * as identityActions from './actions'

describe('IdentityManager reducer', () => {
  it('initially has an empty identity', () => {
    expect(initialState).toEqual({})
  })

  it('can add an identity', () => {
    const identity = { some: 'identity' }
    const action = identityActions.store(identity)
    const state = identityReducer(initialState, action)

    expect(state).toEqual(identity)
  })

  it('handles a pending addition', () => {
    const action = identityActions.addIsPending()
    const state = identityReducer(initialState, action)
    expect(state.creating).toBeTruthy()
  })

  it('handles a finished addition', () => {
    const action = identityActions.addIsFinished()
    const state = identityReducer({ creating: true }, action)
    expect(state.creating).toBeFalsy()
  })
})
