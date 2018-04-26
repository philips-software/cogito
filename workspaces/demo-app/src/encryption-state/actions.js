import { CogitoEncryption } from '@cogitojs/cogito-encryption'

class EncryptionActions {
  static setPlainText = (plainText) => ({
    type: 'ENCRYPTION_SET_PLAINTEXT',
    plainText
  })

  static setCipherText = (cipherText) => ({
    type: 'ENCRYPTION_SET_CIPHERTEXT',
    cipherText
  })

  static encrypt = ({ telepathChannel }) => {
    const encryption = new CogitoEncryption({ telepathChannel })
    return async (dispatch, getState) => {
      const plainText = getState().encryption.plainText
      const tag = await encryption.createNewKeyPair()
      const cipherText = await encryption.encrypt({ tag, plainText })
      dispatch(EncryptionActions.setCipherText(cipherText))
    }
  }
}

export { EncryptionActions }
