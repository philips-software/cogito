import { identityReducer, initialState } from './reducer'
import * as identityActions from './actions'

describe('IdentityManager reducer', () => {
  it('has no identities initially', () => {
    expect(initialState.identities).toHaveLength(0)
  })

  it('can add an identity', () => {
    const name = 'some name'
    const action = identityActions.add({ name })
    const state = identityReducer(initialState, action)
    expect(state.identities).toHaveLength(1)
    expect(state.identities[0]).toBe(name)
  })
})
