export class AttestationsActions {
  static retrievedAttestation = (attestation) => ({
    type: 'RETRIEVED_ATTESTATION',
    attestation
  })

  static retrieve = ({ type, telepathChannel }) => {
    return async (dispatch) => {
      const request = {
        jsonrpc: '2.0',
        id: nextRequestId++,
        method: 'attestations',
        params: { type }
      }
      const response = await telepathChannel.send(request)
      dispatch(AttestationsActions.retrievedAttestation(response.result))
    }
  }
}

let nextRequestId = 0
