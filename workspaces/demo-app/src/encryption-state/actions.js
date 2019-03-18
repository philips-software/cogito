import { CogitoEncryption, CogitoKeyProvider } from '@cogitojs/cogito-encryption'

class EncryptionActions {
  static setPlainText = (plainText) => ({
    type: 'ENCRYPTION_SET_PLAINTEXT',
    plainText
  })

  static setCipherText = (cipherText) => ({
    type: 'ENCRYPTION_SET_CIPHERTEXT',
    cipherText
  })

  static setKeyTag = (tag) => ({
    type: 'ENCRYPTION_SET_KEY_TAG',
    tag
  })

  static encryptionError = (message) => ({
    type: 'ENCRYPTION_ERROR',
    message
  })

  static encrypt = ({ telepathChannel }) => {
    const cogitoEncryption = new CogitoEncryption({ telepathChannel })
    const cogitoKeyProvider = new CogitoKeyProvider({ telepathChannel })
    return async (dispatch, getState) => {
      const plainText = getState().encryption.plainText
      let jsonWebKey

      try {
        const tag = await cogitoKeyProvider.createNewKeyPair()
        dispatch(EncryptionActions.setKeyTag(tag))

        jsonWebKey = await cogitoKeyProvider.getPublicKey({ tag })
      } catch (error) {
        dispatch(EncryptionActions.encryptionError(error.message))
      }

      const cipherText = await cogitoEncryption.encrypt({ jsonWebKey, plainText })

      dispatch(EncryptionActions.setPlainText(''))
      dispatch(EncryptionActions.setCipherText(cipherText))
    }
  }

  static decrypt = ({ telepathChannel }) => {
    const encryption = new CogitoEncryption({ telepathChannel })
    return async (dispatch, getState) => {
      const cipherText = getState().encryption.cipherText
      const tag = getState().encryption.keyTag
      const plainText = await encryption.decrypt({ tag, encryptionData: cipherText })
      dispatch(EncryptionActions.setPlainText(plainText))
    }
  }
}

export { EncryptionActions }
