import { encryptionReducer } from './reducer'
import { EncryptionActions } from './actions'
import deepFreeze from 'deep-freeze-es6'

describe('encryption state reducer', () => {
  describe('initial state', () => {
    let initialState

    beforeEach(() => {
      initialState = encryptionReducer(undefined, 'some action')
    })

    it('has empty plainText', () => {
      expect(initialState.plainText).toBe('')
    })

    it('has empty cipherText', () => {
      expect(initialState.cipherText).toBe('')
    })

    it('is not pending', () => {
      expect(initialState.pending).toBe(false)
    })

    it('has a null errorMessage', () => {
      expect(initialState.errorMessage).toBeNull()
    })
  })

  it('updates the plain text', () => {
    const newPlainText = 'new plain text'
    const state = deepFreeze({ plainText: 'old plain text' })
    const action = EncryptionActions.setPlainText(newPlainText)
    expect(encryptionReducer(state, action).plainText).toBe(newPlainText)
  })

  it('updates the cipher text', () => {
    const newCipherText = 'new cipher text'
    const state = deepFreeze({ cipherText: 'old cipher text' })
    const action = EncryptionActions.setCipherText(newCipherText)
    expect(encryptionReducer(state, action).cipherText).toBe(newCipherText)
  })

  it('updates the key tag', () => {
    const newKeyTag = 'new key tag'
    const state = deepFreeze({ keyTag: 'old key tag' })
    const action = EncryptionActions.setKeyTag(newKeyTag)
    expect(encryptionReducer(state, action).keyTag).toBe(newKeyTag)
  })

  it('signals that encryption is pending', () => {
    const state = deepFreeze({ pending: false })
    const action = EncryptionActions.encryptPending()

    expect(encryptionReducer(state, action).pending).toBe(true)
  })

  it('signals that decryption is pending', () => {
    const state = deepFreeze({ pending: false })
    const action = EncryptionActions.decryptPending()

    expect(encryptionReducer(state, action).pending).toBe(true)
  })

  it('signals that encryption is completed', () => {
    const state = deepFreeze({ pending: true })
    const action = EncryptionActions.encryptCompleted()

    expect(encryptionReducer(state, action).pending).toBe(false)
  })

  it('signals that decryption is completed', () => {
    const state = deepFreeze({ pending: true })
    const action = EncryptionActions.decryptCompleted()

    expect(encryptionReducer(state, action).pending).toBe(false)
  })

  it('clears the error message when encryption pending', () => {
    const state = deepFreeze({ errorMessage: 'Some error message' })
    const action = EncryptionActions.encryptPending()
    expect(encryptionReducer(state, action).errorMessage).toBeNull()
  })

  it('clears the error message when decryption pending', () => {
    const state = deepFreeze({ errorMessage: 'Some error message' })
    const action = EncryptionActions.decryptPending()
    expect(encryptionReducer(state, action).errorMessage).toBeNull()
  })

  it('updates the error message', () => {
    const errorMessage = 'Some error message'
    const state = deepFreeze({ errorMessage: null })
    const action = EncryptionActions.encryptionError(errorMessage)
    expect(encryptionReducer(state, action).errorMessage).toBe(errorMessage)
  })

  it('signals completion upon error', () => {
    const state = deepFreeze({ pending: true })
    const action = EncryptionActions.encryptionError('')
    expect(encryptionReducer(state, action).pending).toBe(false)
  })
})
