import { CogitoEncryption } from './CogitoEncryption'
import { CogitoStreamDecoder } from './CogitoStreamDecoder'
import { StreamEncoder, Sodium } from '@cogitojs/crypto'

import { rsaGenerateKeyPair, rsaEncrypt } from './rsa'

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

describe('CogitoStreamDecoder', () => {
  const { publicKey } = rsaGenerateKeyPair({ bits: 600 })
  let telepath

  beforeAll(async () => {
    await CogitoEncryption.initialize()
  })

  beforeEach(async () => {
    telepath = { send: jest.fn() }
  })

  describe('creating', function () {
    const tag = 'test tag'
    const cryptoMaterial = {
      encryptedStreamKey: 'encryptedStreamKey as Uint8Array',
      streamHeader: 'streamHeader as Uint8Array'
    }
    it('expects a telepath channel, iOS key tag, and crypto material to be provided in the constructor', () => {
      let cogitoStreamDecoder
      expect(() => {
        cogitoStreamDecoder = new CogitoStreamDecoder({
          telepath,
          tag,
          cryptoMaterial
        })
      }).not.toThrow()
      expect(cogitoStreamDecoder).toBeDefined()
    })

    it('throws if no parameters has not been provided in the constructor', () => {
      let cogitoStreamDecoder
      expect(() => { cogitoStreamDecoder = new CogitoStreamDecoder() }).toThrow()
      expect(cogitoStreamDecoder).not.toBeDefined()
    })

    it('throws if telepath channel has not been provided in the constructor', () => {
      let cogitoStreamDecoder
      expect(() => { cogitoStreamDecoder = new CogitoStreamDecoder({ tag, cryptoMaterial }) }).toThrow()
      expect(cogitoStreamDecoder).not.toBeDefined()
    })

    it('throws if tag has not been provided in the constructor', () => {
      let cogitoStreamDecoder
      expect(() => { cogitoStreamDecoder = new CogitoStreamDecoder({ telepath, cryptoMaterial }) }).toThrow()
      expect(cogitoStreamDecoder).not.toBeDefined()
    })

    it('throws if crypto material has not been provided in the constructor', () => {
      let cogitoStreamDecoder
      expect(() => { cogitoStreamDecoder = new CogitoStreamDecoder({ tag, telepath }) }).toThrow()
      expect(cogitoStreamDecoder).not.toBeDefined()
    })

    it('throws if crypto material provided in the constructor is not correct', () => {
      let cogitoStreamDecoder
      const cryptoMaterial = {}
      expect(() => { cogitoStreamDecoder = new CogitoStreamDecoder({ telepath, tag, cryptoMaterial }) }).toThrow()
      expect(cogitoStreamDecoder).not.toBeDefined()
    })
  })

  describe('decrypting', () => {
    const tag = 'some tag'
    let encoder
    let streamKey
    let streamHeader
    let cryptoMaterial
    let cogitoStreamDecoder

    const createTestTextMessages = N => {
      return [...Array(N).keys()].map(e => `message_${e}`)
    }

    const getTestEncryptedStream = N => {
      const messages = createTestTextMessages(N)
      return messages.map((m, index) => {
        return index === N - 1
          ? encoder.end(fromString(m))
          : encoder.push(fromString(m))
      })
    }

    const expectedTags = N => {
      return [...Array(N).keys()].map((e, index) => {
        return index < N - 1 ? Sodium.TAG_MESSAGE : Sodium.TAG_FINAL
      })
    }

    const setupTelepathMock = () => {
      const response = { jsonrpc: '2.0', result: '0x' + Buffer.from(streamKey.buffer).toString('hex') }
      telepath.send.mockResolvedValue(response)
    }

    const createTestCryptoMaterial = () => {
      encoder = new StreamEncoder()
      const { key, header } = encoder.cryptoMaterial
      streamKey = key
      streamHeader = header

      const encryptedStreamKey = rsaEncrypt({
        publicKey,
        plainText: streamKey
      })

      cryptoMaterial = {
        encryptedStreamKey: bufferToUint8Array(encryptedStreamKey),
        streamHeader
      }
    }

    const encryptMessage = message => {
      return encoder.end(message)
    }

    beforeEach(() => {
      createTestCryptoMaterial()

      setupTelepathMock()

      cogitoStreamDecoder = new CogitoStreamDecoder({
        telepath,
        tag,
        cryptoMaterial
      })
    })

    describe('when preparing', () => {
      it('asks Cogito iOS to decrypt the stream key when preparing the decoder', async () => {
        expect.assertions(1)

        await cogitoStreamDecoder.prepare()

        const request = {
          jsonrpc: '2.0',
          method: 'decrypt',
          params: {
            tag,
            cipherText: '0x' + Buffer.from(cryptoMaterial.encryptedStreamKey.buffer).toString('hex')
          }
        }
        expect(telepath.send.mock.calls[0][0]).toMatchObject(request)
      })

      it('retrieves the decrypted stream key from Cogito iOS', async () => {
        expect.assertions(1)

        await cogitoStreamDecoder.prepare()

        expect(cogitoStreamDecoder.streamKey).toEqual(streamKey)
      })

      it('throws when error is returned', async () => {
        expect.assertions(1)

        const error = new Error('some error')
        telepath.send.mockResolvedValue({ jsonrpc: '2.0', error })
        await expect(cogitoStreamDecoder.prepare()).rejects.toThrowError(error)
      })
    })

    describe('when decoding', function () {
      it('delegates decrypting data chunks to underlying stream decoder', () => {
        const testMessage = 'message'
        const encryptedTestMessage = encryptMessage(testMessage)

        const streamDecoder = {
          pull: jest.fn().mockReturnValueOnce(testMessage)
        }

        cogitoStreamDecoder.decoder = streamDecoder

        cogitoStreamDecoder.pull(encryptedTestMessage)

        expect(streamDecoder.pull).toHaveBeenCalledTimes(1)
        expect(streamDecoder.pull.mock.calls[0][0]).toEqual(encryptedTestMessage)
      })

      it('returns the value returned by the underlying stream decoder', () => {
        const testMessage = 'message'
        const encryptedTestMessage = encryptMessage(testMessage)

        const streamDecoder = {
          pull: jest.fn().mockReturnValueOnce(testMessage)
        }

        cogitoStreamDecoder.decoder = streamDecoder

        expect(cogitoStreamDecoder.pull(encryptedTestMessage)).toBe(testMessage)
      })

      it('decrypts the encrypted stream - end-to-end test', async () => {
        expect.assertions(2)

        const N = 10
        const messages = createTestTextMessages(N)
        const encryptedStream = getTestEncryptedStream(N)

        await cogitoStreamDecoder.prepare()

        const decryptedData = encryptedStream.map(m => cogitoStreamDecoder.pull(m))

        const decryptedMessages = decryptedData.map(d => toString(d.message))
        const decryptedTags = decryptedData.map(d => d.tag)

        expect(decryptedMessages).toEqual(messages)
        expect(decryptedTags).toEqual(expectedTags(N))
      })
    })
  })
})
