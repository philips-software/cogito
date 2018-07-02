import { CogitoEncryption } from './CogitoEncryption'
import { CogitoStreamEncoder } from './CogitoStreamEncoder'
import { random, keySize, StreamDecoder, Sodium } from '@cogitojs/crypto'

import { rsaGenerateKeyPair, rsaDecrypt } from './rsa'
import base64url from 'base64url'

const str2ab = str => {
  var buf = new ArrayBuffer(str.length * 2) // 2 bytes for each char
  var bufView = new Uint16Array(buf)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

const ab2str = buf => {
  return String.fromCharCode.apply(null, new Uint16Array(buf))
}

const toString = uint8array => {
  return ab2str(uint8array.buffer)
}

const fromString = str => {
  return new Uint8Array(str2ab(str))
}

const bufferToArrayBuffer = buf => {
  if (buf.length === buf.buffer.byteLength) {
    return buf.buffer
  }
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}

const bufferToUint8Array = buf => {
  return new Uint8Array(bufferToArrayBuffer(buf))
}

describe('CogitoStreamEncoder', () => {
  const { privateKey, publicKey } = rsaGenerateKeyPair({ bits: 600 })
  const jsonWebKey = {
    kty: 'RSA',
    n: base64url.encode(publicKey.n.toByteArray()),
    e: base64url.encode(publicKey.e.toByteArray()),
    alg: 'RS256'
  }

  beforeAll(async () => {
    await CogitoEncryption.initialize()
  })

  describe('creating', function () {
    it('expects an iOS public key in JSON Web Key format to be provided in the constructor', () => {
      let cogitoStreamEncoder
      expect(() => {
        cogitoStreamEncoder = new CogitoStreamEncoder({
          jsonWebKey
        })
      }).not.toThrow()
      expect(cogitoStreamEncoder).toBeDefined()
    })

    it('throws if JSON Web Key has not been provided in the constructor', () => {
      let cogitoStreamEncoder
      expect(() => { cogitoStreamEncoder = new CogitoStreamEncoder() }).toThrow()
      expect(cogitoStreamEncoder).not.toBeDefined()
    })
  })

  describe('encrypting', function () {
    let streamKey
    const streamHeader = fromString('stream initialization header as Uint8Array')
    const testCipher1 = 'cipherText1 as Uint8Array'
    const testCipher2 = 'cipherText2 as Uint8Array'
    let mockStreamEncoder
    let cogitoStreamEncoder

    const createRandomKey = async () => {
      return random(await keySize())
    }

    beforeEach(async () => {
      streamKey = await createRandomKey()
      mockStreamEncoder = {
        cryptoMaterial: {
          key: streamKey,
          header: streamHeader
        },
        push: jest.fn().mockReturnValueOnce(testCipher1),
        end: jest.fn().mockReturnValueOnce(testCipher2)
      }
      cogitoStreamEncoder = new CogitoStreamEncoder({ jsonWebKey })
      cogitoStreamEncoder.encoder = mockStreamEncoder
    })

    it('delegates to crypto library when pushing to the stream', () => {
      const message = 'Great success!'
      const data = fromString(message)

      const cipher = cogitoStreamEncoder.push(data)

      expect(cipher).toBe(testCipher1)
      expect(mockStreamEncoder.push).toHaveBeenCalledTimes(1)
      expect(toString(mockStreamEncoder.push.mock.calls[0][0])).toBe(message)
    })

    it('delegates to crypto library when ending the stream', () => {
      const message = 'Great success!'
      const data = fromString(message)

      const cipher = cogitoStreamEncoder.end(data)

      expect(cipher).toBe(testCipher2)
      expect(mockStreamEncoder.end).toHaveBeenCalledTimes(1)
      expect(toString(mockStreamEncoder.end.mock.calls[0][0])).toBe(message)
    })

    it('returns streaming key that is encrypted using provided JSON Web Key', () => {
      const { encryptedStreamKey } = cogitoStreamEncoder.cryptoMaterial

      const decryptedStreamingKey = rsaDecrypt({ privateKey, cipherText: encryptedStreamKey })

      expect(bufferToUint8Array(decryptedStreamingKey)).toEqual(streamKey)
    })

    it('provides streaming header', () => {
      const { streamHeader } = cogitoStreamEncoder.cryptoMaterial

      expect(streamHeader).toBeDefined()
    })

    it('encrypts a series of messages - end to end test', () => {
      const message1 = 'Message 1'
      const message2 = 'Message 2'

      const data1 = fromString(message1)
      const data2 = fromString(message2)

      cogitoStreamEncoder = new CogitoStreamEncoder({ jsonWebKey })
      const cipherText1 = cogitoStreamEncoder.push(data1)
      const cipherText2 = cogitoStreamEncoder.end(data2)

      const { encryptedStreamKey, streamHeader } = cogitoStreamEncoder.cryptoMaterial
      const decryptedStreamingKey = rsaDecrypt({ privateKey, cipherText: encryptedStreamKey })

      const streamDecoder = new StreamDecoder({
        key: bufferToUint8Array(decryptedStreamingKey),
        header: streamHeader
      })
      const {message: clearText1, tag: tag1} = streamDecoder.pull(cipherText1)
      const {message: clearText2, tag: tag2} = streamDecoder.pull(cipherText2)

      expect(toString(clearText1)).toBe(message1)
      expect(tag1).toBe(Sodium.TAG_MESSAGE)
      expect(toString(clearText2)).toBe(message2)
      expect(tag2).toBe(Sodium.TAG_FINAL)
    })
  })
})
