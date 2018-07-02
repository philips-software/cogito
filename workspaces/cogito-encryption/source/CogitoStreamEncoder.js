import { StreamEncoder } from '@cogitojs/crypto'
import { rsaCreatePublicKey, rsaEncrypt } from './rsa'
import base64url from 'base64url'

class CogitoStreamEncoder {
  jsonWebKey
  encoder = new StreamEncoder()
  encryptedStreamKey
  streamHeader

  get cryptoMaterial () {
    if (!this.encryptedStreamingKey) {
      const { key: streamKey, header: streamHeader } = this.encoder.cryptoMaterial
      const publicKey = this.createRsaPublicKey({ jsonWebKey: this.jsonWebKey })
      this.encryptedStreamKey = rsaEncrypt({ publicKey, plainText: streamKey })
      this.streamHeader = streamHeader
    }
    return {
      encryptedStreamKey: this.encryptedStreamKey,
      streamHeader: this.streamHeader
    }
  }

  createRsaPublicKey ({ jsonWebKey }) {
    const signedN = base64url.toBuffer(jsonWebKey.n)
    const signedE = base64url.toBuffer(jsonWebKey.e)
    const n = Buffer.concat([Buffer.from([0]), signedN])
    const e = Buffer.concat([Buffer.from([0]), signedE])
    return rsaCreatePublicKey({ n, e })
  }

  checkArguments (jsonWebKey) {
    let errorMessage
    if (!jsonWebKey) {
      errorMessage = 'iOS Public key in JSON Web Key format'
    } else {
      const { kty, n, e, alg } = jsonWebKey

      if (!kty || !n || !e || !alg) {
        errorMessage = 'incomplete JSON Web Key'
      }
    }

    if (errorMessage) {
      throw new Error(`Missing or incomplete constructor arguments: ${errorMessage}.`)
    }
  }

  constructor ({ jsonWebKey }) {
    this.checkArguments(jsonWebKey)
    this.jsonWebKey = jsonWebKey
  }

  push (data) {
    return this.encoder.push(data)
  }

  end (data) {
    return this.encoder.end(data)
  }
}

export { CogitoStreamEncoder }
