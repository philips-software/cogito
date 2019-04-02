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

  it('updates the key tag', () => {
    const newKeyTag = 'new key tag'
    const state = deepFreeze({ keyTag: 'old key tag' })
    const action = EncryptionActions.setKeyTag(newKeyTag)
    expect(encryptionReducer(state, action).keyTag).toBe(newKeyTag)
  })

  describe('encryption', () => {
    const cipherText = 'Some cipher text'
    let encryptPendingAction, encryptCompletedAction

    beforeEach(() => {
      encryptCompletedAction = EncryptionActions.encryptCompleted({ cipherText })
      encryptPendingAction = EncryptionActions.encryptPending()
    })

    it('signals that encryption is pending', () => {
      const state = deepFreeze({ pending: false })
      expect(encryptionReducer(state, encryptPendingAction).pending).toBe(true)
    })

    it('clears the error message when encryption pending', () => {
      const state = deepFreeze({ errorMessage: 'Some error message' })
      expect(encryptionReducer(state, encryptPendingAction).errorMessage).toBeNull()
    })

    it('signals that encryption is completed', () => {
      const state = deepFreeze({ pending: true })
      expect(encryptionReducer(state, encryptCompletedAction).pending).toBe(false)
    })

    it('clears the plain text when encryption is completed', () => {
      const state = deepFreeze({ pending: true, plainText: 'Some plain text' })
      expect(encryptionReducer(state, encryptCompletedAction).plainText).toBe('')
    })

    it('sets the cipher text when encryption is completed', () => {
      const state = deepFreeze({ pending: true, cipherText: '' })
      expect(encryptionReducer(state, encryptCompletedAction).cipherText).toBe(cipherText)
    })
  })

  describe('decryption', () => {
    let decryptCompletedAction, decryptPendingAction

    beforeEach(() => {
      decryptCompletedAction = EncryptionActions.decryptCompleted()
      decryptPendingAction = EncryptionActions.decryptPending()
    })

    it('signals that decryption is pending', () => {
      const state = deepFreeze({ pending: false })
      expect(encryptionReducer(state, decryptPendingAction).pending).toBe(true)
    })

    it('clears the error message when decryption pending', () => {
      const state = deepFreeze({ errorMessage: 'Some error message' })
      expect(encryptionReducer(state, decryptPendingAction).errorMessage).toBeNull()
    })

    it('signals that decryption is completed', () => {
      const state = deepFreeze({ pending: true })
      expect(encryptionReducer(state, decryptCompletedAction).pending).toBe(false)
    })
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
