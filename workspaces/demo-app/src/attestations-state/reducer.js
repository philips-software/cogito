export const attestationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RETRIEVED_ATTESTATIONS':
      return { ...state, retrieved: action.attestations }
    default:
      return { ...state }
  }
}

const initialState = {
  retrieved: []
}
