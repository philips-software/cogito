import { attestationsReducer } from './reducer'
import { AttestationsActions } from './actions'
import deepFreeze from 'deep-freeze-es6'

describe('attestations state reducer', () => {
  const attestation = 'some:attestation'

  it('stores a retreived attestation', () => {
    const state = deepFreeze({ retrieved: 'old:attestation' })
    const action = AttestationsActions.retrievedAttestation(attestation)
    expect(attestationsReducer(state, action).retrieved).toBe(attestation)
  })
})
