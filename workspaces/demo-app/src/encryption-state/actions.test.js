import { createNewKeyPairMock } from '@cogitojs/cogito-encryption'
import { EncryptionActions } from './actions'

describe('encrypt action', () => {
  it('creates a new key pair', async () => {
    const dispatch = () => {}
    const getState = () => ({ encryption: { plainText: '' } })
    const action = EncryptionActions.encrypt({ telepathChannel: null })
    await action(dispatch, getState)
    expect(createNewKeyPairMock).toBeCalled()
  })
})
