import { StreamEncoder } from './StreamEncoder'
import { StreamDecoder } from './StreamDecoder'

import { Sodium } from './Sodium'

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

describe('StreamEncoderDecoder', () => {
  let streamEncoder

  beforeAll(async () => {
    await Sodium.wait()
  })

  beforeEach(() => {
    streamEncoder = new StreamEncoder()
  })

  const expectedTags = N => {
    return [...Array(N).keys()].map((e, index) => {
      return index < N - 1 ? Sodium.TAG_MESSAGE : Sodium.TAG_FINAL
    })
  }

  const createTestTextMessages = N => {
    return [...Array(N).keys()].map(e => `message_${e}`)
  }

  // This returns:
  // [
  //   '[0,0,0,0,...]',
  //   '[1,1,1,1,...]',
  //   '[2,2,2,2,...]',
  //   ...
  // ]
  const createTestUint8ArrayMessages = (N, M) => {
    return [...Array(N).keys()].map(e => Uint8Array.from({ length: 5 }, (v, k) => e))
  }

  it('can encode a one element stream', () => {
    const message = 'Great success!'

    const data = fromString(message)
    const cipherText = streamEncoder.end(data)

    const streamDecoder = new StreamDecoder(streamEncoder.cryptoMaterial)
    const { message: clearText, tag } = streamDecoder.pull(cipherText)

    expect(toString(clearText)).toBe(message)
    expect(tag).toBe(Sodium.TAG_FINAL)
  })

  it('can encode two element stream', async () => {
    const message1 = 'Message 1'
    const message2 = 'Message 2'

    const data1 = fromString(message1)
    const data2 = fromString(message2)
    const cipherText1 = streamEncoder.push(data1)
    const cipherText2 = streamEncoder.end(data2)

    const streamDecoder = new StreamDecoder(streamEncoder.cryptoMaterial)
    const { message: clearText1, tag: tag1 } = streamDecoder.pull(cipherText1)
    const { message: clearText2, tag: tag2 } = streamDecoder.pull(cipherText2)

    expect(toString(clearText1)).toBe(message1)
    expect(tag1).toBe(Sodium.TAG_MESSAGE)
    expect(toString(clearText2)).toBe(message2)
    expect(tag2).toBe(Sodium.TAG_FINAL)
  })

  it('can encode multiple element stream', () => {
    const N = 1000
    const messages = createTestTextMessages(N)

    const encryptedData = messages.map((m, index) => {
      return index === N - 1
        ? streamEncoder.end(fromString(m))
        : streamEncoder.push(fromString(m))
    })

    const streamDecoder = new StreamDecoder(streamEncoder.cryptoMaterial)

    const decryptedData = encryptedData.map(m => streamDecoder.pull(m))

    const decryptedMessages = decryptedData.map(d => toString(d.message))
    const decryptedTags = decryptedData.map(d => d.tag)

    expect(decryptedMessages).toEqual(messages)
    expect(decryptedTags).toEqual(expectedTags(N))
  })

  it('can encode multiple element stream when working directly with array buffers', () => {
    const N = 10
    const messages = createTestUint8ArrayMessages(N, 5)

    const encryptedData = messages.map((m, index) => {
      return index === N - 1
        ? streamEncoder.end(m)
        : streamEncoder.push(m)
    })

    const streamDecoder = new StreamDecoder(streamEncoder.cryptoMaterial)

    const decryptedData = encryptedData.map(m => streamDecoder.pull(m))

    const decryptedMessages = decryptedData.map(d => d.message)
    const decryptedTags = decryptedData.map(d => d.tag)

    expect(decryptedMessages).toEqual(messages)
    expect(decryptedTags).toEqual(expectedTags(N))
  })

  it('can encode multiple element stream - large amounts of data', () => {
    const N = 5 * 1024
    const messages = createTestUint8ArrayMessages(N, 1024)

    const encryptedData = messages.map((m, index) => {
      return index === N - 1
        ? streamEncoder.end(m)
        : streamEncoder.push(m)
    })

    const streamDecoder = new StreamDecoder(streamEncoder.cryptoMaterial)
    const decryptedData = encryptedData.map(m => streamDecoder.pull(m))

    const decryptedMessages = decryptedData.map(d => d.message)
    const decryptedTags = decryptedData.map(d => d.tag)

    expect(decryptedMessages).toEqual(messages)
    expect(decryptedTags).toEqual(expectedTags(N))
  })

  describe('Stream Encoder', () => {
    describe('when Sodium has not been initialized', () => {
      const error = new Error('Sodium not initialized! Did you forget to call `await Sodium.wait()`?')

      beforeEach(() => {
        Sodium.ready = false
      })

      afterEach(() => {
        Sodium.ready = true
      })

      it('throws an error if you try to create StreamEncoder', () => {
        expect(() => { console.log(new StreamEncoder()) }).toThrow(error)
      })

      it('throws an error if you try to push to the stream', () => {
        const dataChunk = Uint8Array.from({ length: 10 }, (v, k) => k)
        expect(() => { streamEncoder.push(dataChunk) }).toThrow(error)
      })

      it('throws an error if you try to end the stream', () => {
        const dataChunk = Uint8Array.from({ length: 10 }, (v, k) => k)
        expect(() => { streamEncoder.end(dataChunk) }).toThrow(error)
      })

      it('throws an error if you access cryptoMaterial', () => {
        expect(() => { console.log(streamEncoder.cryptoMaterial) }).toThrow(error)
      })
    })
  })

  describe('Stream Decoder', () => {
    describe('when Sodium has not been initialized', () => {
      const error = new Error('Sodium not initialized! Did you forget to call `await Sodium.wait()`?')
      let cryptoMaterial
      let streamDecoder

      beforeEach(() => {
        cryptoMaterial = streamEncoder.cryptoMaterial
        streamDecoder = new StreamDecoder(cryptoMaterial)
        Sodium.ready = false
      })

      afterEach(() => {
        Sodium.ready = true
      })

      it('throws an error if you try to create StreamDecoder', () => {
        expect(() => { console.log(new StreamDecoder(cryptoMaterial)) }).toThrow(error)
      })

      it('throws an error if you try to pull from the stream', () => {
        Sodium.ready = true
        const dataChunk = Uint8Array.from({ length: 10 }, (v, k) => k)
        const encryptedChunk = streamEncoder.end(dataChunk)
        Sodium.ready = false
        expect(() => { streamDecoder.pull(encryptedChunk) }).toThrow(error)
      })
    })
  })
})
