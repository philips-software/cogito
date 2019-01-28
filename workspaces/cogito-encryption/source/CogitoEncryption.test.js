import { CogitoEncryption } from './CogitoEncryption'
import { rsaGenerateKeyPair, rsaDecrypt } from './rsa'
import base64url from 'base64url'
import { Sodium, random, keySize, nonceSize, encrypt, decrypt } from '@cogitojs/crypto'
import { Buffers, TypedArrays } from '@react-frontend-developer/buffers'

describe('encryption', () => {
  const { publicKey, privateKey } = rsaGenerateKeyPair({ bits: 600 })

  let cogitoEncryption
  let telepathChannel

  beforeEach(() => {
    telepathChannel = { send: jest.fn() }
    cogitoEncryption = new CogitoEncryption({ telepathChannel })
  })

  describe('initializing cogito encryption', () => {
    afterEach(() => {
      Sodium.wait.mockRestore()
    })

    it('waits for Sodium library to be ready', async () => {
      expect.assertions(1)
      Sodium.wait = jest.fn().mockResolvedValueOnce()

      await CogitoEncryption.initialize()

      expect(Sodium.wait.mock.calls.length).toBe(1)
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
      const response = { jsonrpc: '2.0', result: '0x' + TypedArrays.uint8Array2string(symmetricKey, 'hex') }
      telepathChannel.send.mockResolvedValue(response)
    })

    it('asks Cogito to decrypt the symmetrical key', async () => {
      expect.assertions(1)
      await cogitoEncryption.decrypt({ tag, encryptionData: encryptionData })
      const request = {
        jsonrpc: '2.0',
        method: 'decrypt',
        params: {
          tag,
          cipherText: '0x' + Buffers.toString(Buffers.fromString(encryptedSymmetricKey, 'utf8'), 'hex')
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
      expect.assertions(1)
      const decryptedText = await cogitoEncryption.decrypt({ tag, encryptionData })
      expect(decryptedText).toBe(plainText)
    })

    it('throws a meaningful error when file to be decrypted is empty', async () => {
      expect.assertions(1)
      const error = new Error('Invalid encrypted content!')
      encryptionData = ''
      try {
        await cogitoEncryption.decrypt({ tag, encryptionData })
      } catch (e) {
        expect(e.message).toBe(error.message)
      }
    })

    it('throws a meaningful error when file to be decrypted misses encrypted symmetric key', async () => {
      expect.assertions(1)
      const error = new Error('Missing encrypted symmetric key!')
      encryptionData = 'encrypted content'
      try {
        await cogitoEncryption.decrypt({ tag, encryptionData })
      } catch (e) {
        expect(e.message).toBe(error.message)
      }
    })

    it('throws a meaningful error when file to be decrypted misses nonce', async () => {
      expect.assertions(1)
      const error = new Error('Missing nonce in the provided content!')
      encryptionData = 'encrypted content.encrypted symmetric key'
      try {
        await cogitoEncryption.decrypt({ tag, encryptionData })
      } catch (e) {
        expect(e.message).toBe(error.message)
      }
    })

    it('throws a meaningful error when decryption fails', async () => {
      expect.assertions(1)
      const error = new Error('wrong secret key for the given ciphertext')
      nonce = await random(await nonceSize())
      encryptionData =
        base64url.encode(cipherText) + '.' +
        base64url.encode(encryptedSymmetricKey) + '.' +
        base64url.encode(nonce)
      try {
        await cogitoEncryption.decrypt({ tag, encryptionData })
      } catch (e) {
        expect(e.message).toBe(error.message)
      }
    })
  })

  describe('encrypting data', () => {
    const plainText = 'plain text'
    const jsonWebKey = {
      'kty': 'RSA',
      'n': base64url.encode(publicKey.n.toByteArray()),
      'e': base64url.encode(publicKey.e.toByteArray()),
      'alg': 'RS256'
    }

    it('returns encrypted symmetric key, cipherText and nonce', async () => {
      expect.assertions(1)
      const encryptionData = await cogitoEncryption.encrypt({ jsonWebKey, plainText })

      const parts = encryptionData.split('.')
      const cipherText = base64url.toBuffer(parts[0])
      const encryptedSymmetricKey = base64url.toBuffer(parts[1])
      const nonce = base64url.toBuffer(parts[2])

      const symmetricKey = rsaDecrypt({ privateKey, cipherText: encryptedSymmetricKey })

      expect(await decrypt(cipherText, nonce, symmetricKey, 'text')).toBe(plainText)
    })
  })
})
