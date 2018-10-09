import { StreamEncoder } from '@cogitojs/crypto'
import { rsaEncrypt } from './rsa'
import { createRsaPublicKey } from './jwk2rsa'

class CogitoStreamEncoder {
  jsonWebKey
  encoder = new StreamEncoder()
  encryptedStreamKey
  streamHeader

  get cryptoMaterial () {
    if (!this.encryptedStreamingKey) {
      const {
        key: streamKey,
        header: streamHeader
      } = this.encoder.cryptoMaterial
      const publicKey = createRsaPublicKey({ jsonWebKey: this.jsonWebKey })
      this.encryptedStreamKey = rsaEncrypt({ publicKey, plainText: streamKey })
      this.streamHeader = streamHeader
    }
    return {
      encryptedStreamKey: this.encryptedStreamKey,
      streamHeader: this.streamHeader
    }
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
      throw new Error(
        `Missing or incomplete constructor arguments: ${errorMessage}.`
      )
    }
  }

  constructor (args = {}) {
    this.checkArguments(args.jsonWebKey)
    this.jsonWebKey = args.jsonWebKey
  }

  push (data) {
    return this.encoder.push(data)
  }

  end (data) {
    return this.encoder.end(data)
  }
}

export { CogitoStreamEncoder }
