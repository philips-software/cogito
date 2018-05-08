import { CogitoEncryption } from './cogito-encryption'
import { rsaGenerateKeyPair, rsaDecrypt } from './rsa'
import base64url from 'base64url'
import { random, keySize, nonceSize, encrypt, decrypt } from '@cogitojs/crypto'

describe('encryption', () => {
  const { publicKey, privateKey } = rsaGenerateKeyPair({ bits: 600 })

  let cogitoEncryption
  let telepathChannel

  beforeEach(() => {
    telepathChannel = { send: jest.fn() }
    cogitoEncryption = new CogitoEncryption({ telepathChannel })
  })

  describe('creating new key pairs', () => {
    const tag = 'some tag'

    beforeEach(() => {
      const response = { jsonrpc: '2.0', result: tag }
      telepathChannel.send.mockResolvedValue(response)
    })

    it('creates new key pairs', async () => {
      await cogitoEncryption.createNewKeyPair()
      const request = { jsonrpc: '2.0', method: 'createEncryptionKeyPair' }
      expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(request)
    })

    it('returns tag after creating new key pair', async () => {
      expect(await cogitoEncryption.createNewKeyPair()).toBe(tag)
    })

    it('throws when error is returned', async () => {
      expect.assertions(1)
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
    const publicKey = 'the public key'

    beforeEach(() => {
      const response = { jsonrpc: '2.0', result: publicKey }
      telepathChannel.send.mockResolvedValue(response)
    })

    it('gets the public key', async () => {
      await cogitoEncryption.getPublicKey({tag})
      const request = {
        jsonrpc: '2.0',
        method: 'getEncryptionPublicKey',
        params: { tag }
      }
      expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(request)
    })

    it('returns the public key after getting it', async () => {
      expect(await cogitoEncryption.getPublicKey(tag)).toBe(publicKey)
    })

    it('throws when error is returned', async () => {
      const error = { code: -42, message: 'some error' }
      telepathChannel.send.mockResolvedValue({ jsonrpc: '2.0', error })
      await expect(cogitoEncryption.getPublicKey({tag})).rejects.toBeDefined()
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
    const plainText = 'some plain text'

    let symmetricKey
    let nonce
    let cipherText
    let encryptedSymmetricKey
    let encryptionData

    beforeEach(async () => {
      symmetricKey = await random(await keySize())
      nonce = await random(await nonceSize())
      cipherText = await encrypt(plainText, nonce, symmetricKey)
      encryptedSymmetricKey = publicKey.encrypt(symmetricKey, 'RSA-OAEP')
      encryptionData =
        base64url.encode(cipherText) + '.' +
        base64url.encode(encryptedSymmetricKey) + '.' +
        base64url.encode(nonce)
      const response = { jsonrpc: '2.0', result: '0x' + Buffer.from(symmetricKey).toString('hex') }
      telepathChannel.send.mockResolvedValue(response)
    })

    it('asks Cogito to decrypt the symmetrical key', async () => {
      await cogitoEncryption.decrypt({ tag, encryptionData: encryptionData })
      const request = {
        jsonrpc: '2.0',
        method: 'decrypt',
        params: {
          tag,
          cipherText: '0x' + Buffer.from(encryptedSymmetricKey).toString('hex')
        }
      }
      expect(telepathChannel.send.mock.calls[0][0]).toMatchObject(request)
    })

    it('throws when error is returned', async () => {
      expect.assertions(1)
      const error = { code: -42, message: 'some error' }
      telepathChannel.send.mockResolvedValue({ jsonrpc: '2.0', error })
      await expect(cogitoEncryption.decrypt({ tag, encryptionData })).rejects.toBeDefined()
    })

    it('decrypts the cipher text', async () => {
      const decryptedText = await cogitoEncryption.decrypt({ tag, encryptionData })
      expect(decryptedText).toBe(plainText)
    })
  })

  describe('encrypting data', () => {
    const plainText = 'plain text'
    const tag = 'some tag'

    beforeEach(async () => {
      const publicKeyJWK = {
        'kty': 'RSA',
        'n': base64url.encode(publicKey.n.toByteArray()),
        'e': base64url.encode(publicKey.e.toByteArray()),
        'alg': 'RS256'
      }
      telepathChannel.send.mockResolvedValue({ result: publicKeyJWK })
    })

    it('returns encrypted symmetric key, cipherText and nonce', async () => {
      const encryptionData = await cogitoEncryption.encrypt({ tag, plainText })

      const parts = encryptionData.split('.')
      const cipherText = base64url.toBuffer(parts[0])
      const encryptedSymmetricKey = base64url.toBuffer(parts[1])
      const nonce = base64url.toBuffer(parts[2])

      const symmetricKey = rsaDecrypt({ privateKey, cipherText: encryptedSymmetricKey })

      expect(await decrypt(cipherText, nonce, symmetricKey, 'text')).toBe(plainText)
    })

    it('throws when public key cannot be retrieved', async () => {
      const error = { code: -42, message: 'some error' }
      telepathChannel.send.mockResolvedValue({ jsonrpc: '2.0', error })
      await expect(cogitoEncryption.encrypt({ tag, plainText })).rejects.toBeDefined()
    })
  })
})
