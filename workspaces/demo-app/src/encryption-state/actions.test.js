import { createNewKeyPairMock, getPublicKeyMock, encryptMock, decryptMock } from '@cogitojs/cogito-encryption'
import { EncryptionActions } from './actions'

describe('encrypt action', () => {
  const tag = 'Some tag'
  const plainText = 'Some plain text to be encrypted'
  const jsonWebKey = { some: 'public key' }

  let dispatch, getState, action

  beforeEach(() => {
    dispatch = jest.fn()
    getState = () => ({ encryption: { plainText } })
    action = EncryptionActions.encrypt({ telepathChannel: null })
  })

  it('signals that encryption is pending', async () => {
    await action(dispatch, getState)

    expect(dispatch).toBeCalledWith(EncryptionActions.encryptPending())
  })

  it('creates a new key pair', async () => {
    await action(dispatch, getState)

    expect(createNewKeyPairMock).toBeCalled()
  })

  it('gets the public key', async () => {
    createNewKeyPairMock.mockResolvedValue(tag)

    await action(dispatch, getState)

    expect(getPublicKeyMock).toBeCalledWith({ tag })
  })

  it('encrypts the plain text', async () => {
    createNewKeyPairMock.mockResolvedValue(tag)
    getPublicKeyMock.mockResolvedValue(jsonWebKey)

    await action(dispatch, getState)

    expect(encryptMock).toBeCalledWith({ jsonWebKey, plainText })
  })

  it('remembers the generated key tag', async () => {
    await action(dispatch, getState)

    expect(dispatch).toBeCalledWith(EncryptionActions.setKeyTag(tag))
  })

  it('signals that encryption is completed', async () => {
    const cipherText = 'Some ciphered text'
    encryptMock.mockResolvedValue(cipherText)

    await action(dispatch, getState)

    expect(dispatch).toBeCalledWith(EncryptionActions.encryptCompleted({ cipherText }))
  })

  describe('handles errors', () => {
    const error = new Error('Some error message')

    it('when creating new key pair', async () => {
      createNewKeyPairMock.mockRejectedValue(error)

      await action(dispatch, getState)

      expect(dispatch).toBeCalledWith(EncryptionActions.encryptionError(error.message))
    })

    it('when getting public key', async () => {
      getPublicKeyMock.mockRejectedValue(error)

      await action(dispatch, getState)

      expect(dispatch).toBeCalledWith(EncryptionActions.encryptionError(error.message))
    })

    it('when encrypting', async () => {
      encryptMock.mockRejectedValue(error)

      await action(dispatch, getState)

      expect(dispatch).toBeCalledWith(EncryptionActions.encryptionError(error.message))
    })
  })
})

describe('decrypt action', () => {
  const tag = 'Some tag'
  const cipherText = 'Some cipher text to be decrypted'
  const plainText = 'Some plain text'

  let dispatch, getState, action

  beforeEach(() => {
    dispatch = jest.fn()
    getState = () => ({ encryption: { cipherText, keyTag: tag } })
    action = EncryptionActions.decrypt({ telepathChannel: null })
  })

  it('signals that decryption is pending', async () => {
    await action(dispatch, getState)

    expect(dispatch).toBeCalledWith(EncryptionActions.decryptPending())
  })

  it('decrypts the cipher text', async () => {
    await action(dispatch, getState)

    expect(decryptMock).toBeCalledWith({ tag, encryptionData: cipherText })
  })

  it('signals that decryption is completed', async () => {
    decryptMock.mockResolvedValue(plainText)

    await action(dispatch, getState)

    expect(dispatch).toBeCalledWith(EncryptionActions.decryptCompleted({ plainText }))
  })

  describe('handles errors', () => {
    it('when decrypting', async () => {
      const error = new Error('Some error message')
      decryptMock.mockRejectedValue(error)

      await action(dispatch, getState)

      expect(dispatch).toBeCalledWith(EncryptionActions.encryptionError(error.message))
    })
  })
})
