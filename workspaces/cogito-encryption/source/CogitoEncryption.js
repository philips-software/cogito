import { rsaEncrypt } from './rsa'
import { createRsaPublicKey } from './jwk2rsa'
import base64url from 'base64url'
import {
  Sodium,
  random,
  keySize,
  nonceSize,
  encrypt,
  decrypt
} from '@cogitojs/crypto'

import { CogitoRequest } from './CogitoRequest'

class CogitoEncryption {
  channel

  constructor ({ telepathChannel }) {
    this.channel = telepathChannel
  }

  static async initialize () {
    await Sodium.wait()
  }

  validate ({ cipherTextPart, keyPart, noncePart }) {
    if (!cipherTextPart || cipherTextPart.length === 0) {
      throw new Error('Invalid encrypted content!')
    }
    if (!keyPart || keyPart.length === 0) {
      throw new Error('Missing encrypted symmetric key!')
    }
    if (!noncePart || noncePart.length === 0) {
      throw new Error('Missing nonce in the provided content!')
    }
  }

  extractEncryptionData (encryptionData) {
    const [cipherTextPart, keyPart, noncePart] = encryptionData.split('.')
    this.validate({ cipherTextPart, keyPart, noncePart })
    const cipherText = base64url.toBuffer(cipherTextPart)
    const encryptedSymmetricKey = bufferToHex(base64url.toBuffer(keyPart))
    const nonce = base64url.toBuffer(noncePart)
    return {
      cipherText,
      encryptedSymmetricKey,
      nonce
    }
  }

  async decryptSymmetricKey ({ encryptedSymmetricKey, tag }) {
    const request = CogitoRequest.create('decrypt', {
      tag,
      cipherText: encryptedSymmetricKey
    })
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }
    return Buffer.from(response.result.slice(2), 'hex')
  }

  async decrypt ({ tag: iOSKeyTag, encryptionData }) {
    const {
      cipherText,
      encryptedSymmetricKey,
      nonce
    } = this.extractEncryptionData(encryptionData)

    const symmetricKey = await this.decryptSymmetricKey({
      encryptedSymmetricKey,
      tag: iOSKeyTag
    })

    return decrypt(cipherText, nonce, symmetricKey, 'text')
  }

  async encrypt ({ jsonWebKey: iOSPublicKey, plainText }) {
    const publicKey = createRsaPublicKey({ jsonWebKey: iOSPublicKey })
    const symmetricKey = await this.createRandomKey()
    const nonce = await random(await nonceSize())
    const cipherText = await encrypt(plainText, nonce, symmetricKey)
    const encryptedSymmetricKey = rsaEncrypt({
      publicKey,
      plainText: symmetricKey
    })

    return (
      base64url.encode(cipherText) +
      '.' +
      base64url.encode(encryptedSymmetricKey) +
      '.' +
      base64url.encode(nonce)
    )
  }

  async createRandomKey () {
    return random(await keySize())
  }
}

const bufferToHex = buffer => '0x' + buffer.toString('hex')

export { CogitoEncryption }
