import { CogitoKeyProvider } from './CogitoKeyProvider'

describe('CogitoKeyProvider', () => {
  let telepathChannel
  let cogitoKeyProvider

  beforeEach(() => {
    telepathChannel = { send: jest.fn() }
    cogitoKeyProvider = new CogitoKeyProvider({ telepathChannel })
  })

  describe('creating new keypairs', () => {
    const tag = 'some tag'

    beforeEach(() => {
      const response = { jsonrpc: '2.0', result: tag }
      telepathChannel.send.mockResolvedValue(response)
    })

    it('creates new key pairs', async () => {
      await cogitoKeyProvider.createNewKeyPair()
      const request = { jsonrpc: '2.0', method: 'createEncryptionKeyPair' }
      expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(request)
    })

    it('returns tag after creating new key pair', async () => {
      expect(await cogitoKeyProvider.createNewKeyPair()).toBe(tag)
    })

    it('throws when error is returned', async () => {
      expect.assertions(1)
      const error = new Error('some error')

      telepathChannel.send.mockResolvedValue({ jsonrpc: '2.0', error })

      await expect(cogitoKeyProvider.createNewKeyPair()).rejects.toThrow(error)
    })

    it('uses different JSON-RPC ids for subsequent requests', async () => {
      await cogitoKeyProvider.createNewKeyPair()
      await cogitoKeyProvider.createNewKeyPair()
      const id1 = telepathChannel.send.mock.calls[0][0].id
      const id2 = telepathChannel.send.mock.calls[1][0].id
      expect(id1).not.toBe(id2)
    })
  })

  describe('retrieving the public key', () => {
    const tag = 'some tag'
    const publicKey = 'the public key'

    beforeEach(() => {
      const response = { jsonrpc: '2.0', result: publicKey }
      telepathChannel.send.mockResolvedValue(response)
    })

    it('gets the public key', async () => {
      await cogitoKeyProvider.getPublicKey({ tag })
      const request = {
        jsonrpc: '2.0',
        method: 'getEncryptionPublicKey',
        params: { tag }
      }
      expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(request)
    })

    it('returns the public key after getting it', async () => {
      expect(await cogitoKeyProvider.getPublicKey(tag)).toBe(publicKey)
    })

    it('throws when error is returned', async () => {
      const error = new Error('some error')
      telepathChannel.send.mockResolvedValue({ jsonrpc: '2.0', error })
      await expect(cogitoKeyProvider.getPublicKey({ tag })).rejects.toThrow(error)
    })

    it('uses different JSON-RPC ids for subsequent requests', async () => {
      await cogitoKeyProvider.getPublicKey({ tag })
      await cogitoKeyProvider.getPublicKey({ tag })
      const id1 = telepathChannel.send.mock.calls[0][0].id
      const id2 = telepathChannel.send.mock.calls[1][0].id
      expect(id1).not.toBe(id2)
    })
  })
})
