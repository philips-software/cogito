export class AttestationsActions {
  static retrievedAttestations = (attestations) => ({
    type: 'RETRIEVED_ATTESTATIONS',
    attestations
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
      dispatch(AttestationsActions.retrievedAttestations(response.result))
    }
  }
}

let nextRequestId = 0
