const encryptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ENCRYPTION_SET_PLAINTEXT':
      return { ...state, plainText: action.plainText }
    case 'ENCRYPTION_SET_CIPHERTEXT':
      return { ...state, cipherText: action.cipherText }
    case 'ENCRYPTION_SET_KEY_TAG':
      return { ...state, keyTag: action.tag }
    case 'ENCRYPTION_PENDING':
    case 'DECRYPTION_PENDING':
      return { ...state, errorMessage: null }
    case 'ENCRYPTION_ERROR':
      return { ...state, errorMessage: action.message }
    default:
      return { ...state }
  }
}

const initialState = {
  plainText: '',
  cipherText: '',
  errorMessage: null
}

export { encryptionReducer }
