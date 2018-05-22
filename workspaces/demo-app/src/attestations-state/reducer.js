export const attestationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RETRIEVED_ATTESTATION':
      return { ...state, retrieved: action.attestation }
    default:
      return { ...state }
  }
}

const initialState = {
  retrieved: undefined
}
