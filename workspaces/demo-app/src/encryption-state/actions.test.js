import { createNewKeyPairMock, getPublicKeyMock } from '@cogitojs/cogito-encryption'
import { EncryptionActions } from './actions'

describe('encrypt action', () => {
  let dispatch, getState, action

  beforeEach(() => {
    dispatch = () => {}
    getState = () => ({ encryption: { plainText: '' } })
    action = EncryptionActions.encrypt({ telepathChannel: null })
  })

  it('creates a new key pair', async () => {
    await action(dispatch, getState)

    expect(createNewKeyPairMock).toBeCalled()
  })

  it('gets the public key', async () => {
    const tag = 'some tag'
    createNewKeyPairMock.mockResolvedValue(tag)

    await action(dispatch, getState)

    expect(getPublicKeyMock).toBeCalledWith({ tag })
  })
})
