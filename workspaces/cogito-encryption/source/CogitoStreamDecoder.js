import { CogitoRequest } from './CogitoRequest'
import { StreamDecoder } from '@cogitojs/crypto'

const bufferToArrayBuffer = buf => {
  if (buf.length === buf.buffer.byteLength) {
    return buf.buffer
  }
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}

const bufferToUint8Array = buf => {
  return new Uint8Array(bufferToArrayBuffer(buf))
}

class CogitoStreamDecoder {
  telepath
  tag
  cryptoMaterial
  streamKey
  decoder

  checkArguments (telepath, tag, cryptoMaterial) {
    let errorMessage
    if (!telepath) {
      errorMessage = 'Telepath Channel'
    }

    if (!tag) {
      errorMessage = errorMessage ? `${errorMessage}, iOS Key Tag` : 'iOS Key Tag'
    }

    if (!cryptoMaterial) {
      errorMessage = errorMessage ? `${errorMessage}, Stream Crypto Material` : 'Stream Crypto Material'
    } else {
      const { encryptedStreamKey, streamHeader } = cryptoMaterial

      if (!encryptedStreamKey || !streamHeader) {
        errorMessage = errorMessage ? `${errorMessage}, incomplete Stream Crypto Material` : 'incomplete Stream Crypto Material'
      }
    }

    if (errorMessage) {
      throw new Error(`Missing or incomplete constructor arguments: ${errorMessage}.`)
    }
  }

  constructor ({ telepath, tag, cryptoMaterial }) {
    this.checkArguments(telepath, tag, cryptoMaterial)
    this.telepath = telepath
    this.tag = tag
    this.cryptoMaterial = cryptoMaterial
  }

  async prepare () {
    const encryptedSymmetricKey = '0x' + Buffer.from(this.cryptoMaterial.encryptedStreamKey.buffer).toString('hex')
    const request = CogitoRequest.create(
      'decrypt',
      { tag: this.tag, cipherText: encryptedSymmetricKey }
    )

    const response = await this.telepath.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }

    this.streamKey = bufferToUint8Array(Buffer.from(response.result.slice(2), 'hex'))
    this.decoder = new StreamDecoder({
      key: this.streamKey,
      header: this.cryptoMaterial.streamHeader
    })
  }

  pull (cipherText) {
    return this.decoder.pull(cipherText)
  }
}

export { CogitoStreamDecoder }
