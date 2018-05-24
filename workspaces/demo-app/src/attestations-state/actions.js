import { AttestationsRetriever } from '@cogitojs/cogito-attestations'

export class AttestationsActions {
  static retrievedAttestations = (attestations) => ({
    type: 'RETRIEVED_ATTESTATIONS',
    attestations
  })

  static retrieve = ({ type, telepathChannel }) => {
    const retriever = new AttestationsRetriever({ telepathChannel })
    return async (dispatch) => {
      const attestations = await retriever.retrieve({ type })
      dispatch(AttestationsActions.retrievedAttestations(attestations))
    }
  }
}
