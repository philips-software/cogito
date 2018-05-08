import { CogitoEncryption } from './cogito-encryption'
import forge from 'node-forge'
import base64url from 'base64url'
import { random, keySize, nonceSize, encrypt, decrypt } from '@cogitojs/crypto'

jest.mock('@cogitojs/crypto')

describe('encryption', () => {
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
    const cipherText = '0xsomeencryptedstuff'
    const plainText = 'decrypted plain text'
    const symmetricalKey = 'symmetricalKey'
    const encryptedSymmetricalKey = 'encryptedSymmetricalKey'
    const nonce = 'nonce'
    const encryptionData = base64url.encode(cipherText) + '.' + base64url.encode(encryptedSymmetricalKey) + '.' + base64url.encode(nonce)

    beforeEach(() => {
      decrypt.mockResolvedValue(Promise.resolve(plainText))
      const response = { jsonrpc: '2.0', result: symmetricalKey }
      telepathChannel.send.mockResolvedValue(response)
    })

    it('asks Cogito to decrypt the symmetrical key', async () => {
      await cogitoEncryption.decrypt({ tag, encryptionData: encryptionData })
      const request = {
        jsonrpc: '2.0',
        method: 'decrypt',
        params: {
          tag,
          cipherText: '0x' + Buffer.from(encryptedSymmetricalKey).toString('hex')
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

    it('decrypts the cipher text using the symmetrical key', async () => {
      await cogitoEncryption.decrypt({ tag, encryptionData })
      expect(decrypt.mock.calls[0][0]).toBe(cipherText)
      expect(decrypt.mock.calls[0][1]).toBe(nonce)
      expect(decrypt.mock.calls[0][2]).toBe(symmetricalKey)
    })

    it('decrypts the cipher text', async () => {
      const decryptedText = await cogitoEncryption.decrypt({ tag, encryptionData })
      expect(decryptedText).toBe(plainText)
    })
  })

  describe('encrypting data', () => {
    const plainText = 'plain text'

    describe('when public key cannot be retrieved', () => {
      const error = new Error('some error')

      beforeEach(() => {
        telepathChannel = {
          send: jest.fn((request) => {
            if (request['method'] === 'getEncryptionPublicKey') {
              return Promise.reject(error)
            }
          })
        }
        cogitoEncryption = new CogitoEncryption({ telepathChannel })
      })

      it('throws', async () => {
        expect.assertions(1)
        await expect(
          cogitoEncryption.encrypt({ tag: 'invalid tag', plainText })
        ).rejects.toThrow(error)
      })
    })

    describe('when public key can be retrieved', () => {
      let encryption
      let keyPair

      beforeEach(async () => {
        telepathChannel = { send: jest.fn() }
        encryption = new CogitoEncryption({ telepathChannel })
        keyPair = await generateKeyPair({bits: 512, workers: -1})
        const publicKeyJWK = {
          'kty': 'RSA',
          'n': base64url.encode(keyPair.publicKey.n.toByteArray()),
          'e': base64url.encode(keyPair.publicKey.e.toByteArray()),
          'alg': 'RS256'
        }
        telepathChannel.send.mockResolvedValue({ result: publicKeyJWK })

        const fakeNonceSize = 1
        const fakeKeySize = 2
        nonceSize.mockImplementation(() => Promise.resolve(fakeNonceSize))
        keySize.mockImplementation(() => Promise.resolve(fakeKeySize))
        random.mockImplementation((size) => {
          return size === fakeNonceSize ? 'nonce' : 'symmetricalKey'
        })
        encrypt.mockImplementation(() => Promise.resolve('encryptedData'))
      })

      it('uses symmetrical encryption to encrypt the plain text', async () => {
        await encryption.encrypt({ tag: 'some tag', plainText })
        expect(encrypt.mock.calls[0][0]).toBe(plainText)
      })

      it('uses public key to encrypt symmetrical key', async () => {
        const encryptionResult = await encryption.encrypt({ tag: 'some tag', plainText })
        const encryptedSymmetricalKey = base64url.decode(encryptionResult.split('.')[1])
        const decryptedKey = keyPair.privateKey.decrypt(encryptedSymmetricalKey, 'RSA-OAEP', { md: forge.md.sha1.create() })
        expect(decryptedKey).toBe('symmetricalKey')
      })

      it('returns cipherText', async () => {
        const encryptionResult = await encryption.encrypt({ tag: 'some tag', plainText })
        const cipherText = base64url.decode(encryptionResult.split('.')[0])
        expect(cipherText).toBe('encryptedData')
      })

      it('returns the nonce', async () => {
        const encryptionResult = await encryption.encrypt({ tag: 'some tag', plainText })
        const nonce = base64url.decode(encryptionResult.split('.')[2])
        expect(nonce).toBe('nonce')
      })
    })
  })
})

async function generateKeyPair (...args) {
  return new Promise(function (resolve, reject) {
    forge.pki.rsa.generateKeyPair(...args, function (error, result) {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}
