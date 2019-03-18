import { createNewKeyPairMock, getPublicKeyMock, encryptMock } from '@cogitojs/cogito-encryption'
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

  it('clears the plain text', async () => {
    await action(dispatch, getState)

    expect(dispatch).toBeCalledWith(EncryptionActions.setPlainText(''))
  })

  it('sets the cipher text', async () => {
    const cipherText = 'Some ciphered text'
    encryptMock.mockResolvedValue(cipherText)

    await action(dispatch, getState)

    expect(dispatch).toBeCalledWith(EncryptionActions.setCipherText(cipherText))
  })

  it('handles exception when creating new key pair', async () => {
    const errorMessage = 'Some error message'
    createNewKeyPairMock.mockRejectedValue(new Error(errorMessage))

    await action(dispatch, getState)

    expect(dispatch).toBeCalledWith(EncryptionActions.encryptionError(errorMessage))
  })
})
