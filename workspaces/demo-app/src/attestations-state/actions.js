import { CogitoAttestations } from '@cogitojs/cogito-attestations'

export class AttestationsActions {
  static retrievedAttestations = (attestations) => ({
    type: 'RETRIEVED_ATTESTATIONS',
    attestations
  })

  static retrieve = ({ type, telepathChannel }) => {
    const cogitoAttestations = new CogitoAttestations({ telepathChannel })
    return async (dispatch) => {
      const attestations = await cogitoAttestations.retrieve({ type })
      dispatch(AttestationsActions.retrievedAttestations(attestations))
    }
  }
}
