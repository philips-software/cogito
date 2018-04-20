import { CogitoEncryption } from './cogito-encryption'

describe('encryption', () => {
  let cogitoEncryption
  let telepathChannel

  beforeEach(() => {
    telepathChannel = { send: jest.fn() }
    cogitoEncryption = new CogitoEncryption({ telepathChannel })
  })

  describe('creating new key pairs', () => {
    const tag = 'some tag'
    const request = { jsonrpc: '2.0', method: 'createEncryptionKeyPair' }
    const response = { jsonrpc: '2.0', result: tag }

    beforeEach(() => {
      telepathChannel.send.mockResolvedValue(response)
    })

    it('creates new key pairs', async () => {
      await cogitoEncryption.createNewKeyPair()
      expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(request)
    })

    it('returns tag after creating new key pair', async () => {
      expect(await cogitoEncryption.createNewKeyPair()).toBe(tag)
    })

    it('throws when error is returned', async () => {
      const error = { code: -42, message: 'some error' }
      telepathChannel.send.mockResolvedValue({ jsonrpc: '2.0', error })
      await expect(cogitoEncryption.createNewKeyPair()).rejects.toBeDefined()
    })

    it('uses different JSON-RPC ids for subsequent requests', async () => {
      await cogitoEncryption.createNewKeyPair()
      await cogitoEncryption.createNewKeyPair()
      const id1 = telepathChannel.send.mock.calls[0][0].id
      const id2 = telepathChannel.send.mock.calls[1][0].id
      expect(id1).not.toBe(id2)
    })
  })

  describe('retrieving the public key', () => {
    const tag = 'some tag'
    const request = { jsonrpc: '2.0', method: 'getEncryptionPublicKey', params: [{ tag }] }
    const publicKey = 'the public key'
    const response = { jsonrpc: '2.0', result: publicKey }

    beforeEach(() => {
      telepathChannel.send.mockResolvedValue(response)
    })

    it('gets the public key', async () => {
      await cogitoEncryption.getPublicKey({tag})
      expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(request)
    })

    it('returns the public key after getting it', async () => {
      expect(await cogitoEncryption.getPublicKey(tag)).toBe(publicKey)
    })

    it('throws when error is returned', async () => {
      const error = { code: -42, message: 'some error' }
      telepathChannel.send.mockResolvedValue({ jsonrpc: '2.0', error })
      await expect(cogitoEncryption.getPublicKey({tag: 'nonexisting tag'})).rejects.toBeDefined()
    })

    it('uses different JSON-RPC ids for subsequent requests', async () => {
      await cogitoEncryption.getPublicKey({tag})
      await cogitoEncryption.getPublicKey({tag})
      const id1 = telepathChannel.send.mock.calls[0][0].id
      const id2 = telepathChannel.send.mock.calls[1][0].id
      expect(id1).not.toBe(id2)
    })
  })

  describe('decrypting data', () => {
    const tag = 'some tag'
    const cipherText = '0xsomeencryptedstuff'
    const request = { jsonrpc: '2.0', method: 'decrypt', params: [{ tag, cipherText }] }
    const plainText = 'decrypted plain text'
    const response = { jsonrpc: '2.0', result: plainText }

    beforeEach(() => {
      telepathChannel.send.mockResolvedValue(response)
    })

    it('decrypts', async () => {
      await cogitoEncryption.decrypt({ tag, cipherText })
      expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(request)
    })

    it('returns the plain text when decrypting', async () => {
      expect(await cogitoEncryption.decrypt({ tag, cipherText })).toBe(plainText)
    })

    it('throws when error is returned', async () => {
      const error = { code: -42, message: 'some error' }
      telepathChannel.send.mockResolvedValue({ jsonrpc: '2.0', error })
      await expect(cogitoEncryption.decrypt({ tag, cipherText })).rejects.toBeDefined()
    })

    it('uses different JSON-RPC ids for subsequent requests', async () => {
      await cogitoEncryption.decrypt({ tag, cipherText })
      await cogitoEncryption.decrypt({ tag, cipherText })
      const id1 = telepathChannel.send.mock.calls[0][0].id
      const id2 = telepathChannel.send.mock.calls[1][0].id
      expect(id1).not.toBe(id2)
    })
  })
})
