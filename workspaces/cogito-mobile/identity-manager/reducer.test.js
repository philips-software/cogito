import { identityReducer, initialState } from './reducer'
import * as identityActions from './actions'

describe('IdentityManager reducer', () => {
  it('initially has an empty identity', () => {
    expect(initialState).toEqual({})
  })

  it('can add an identity', () => {
    const name = 'some name'
    const action = identityActions.store({ name })
    const state = identityReducer(initialState, action)

    expect(state.name).toBe(name)
  })
})
