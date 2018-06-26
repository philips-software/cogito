import { StreamEncoder } from './StreamEncoder'
import { StreamDecoder } from './StreamDecoder'

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
  let streamDecoder

  beforeEach(() => {
    streamEncoder = new StreamEncoder()
    streamDecoder = new StreamDecoder()
  })

  it('can encode a one element stream', async () => {
    const message = 'Great success!'
    const keyAndHeader = await streamEncoder.prepare()

    const data = fromString(message)
    const cipherText = streamEncoder.end(data)

    await streamDecoder.prepare(keyAndHeader)
    const clearText = streamDecoder.pull(cipherText)

    expect(toString(clearText)).toBe(message)
  })
})
