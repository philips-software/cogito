import forge from 'node-forge'
import base64url from 'base64url'
import { random, keySize, nonceSize, encrypt, decrypt } from '@cogitojs/crypto'

class CogitoEncryption {
  constructor ({ telepathChannel }) {
    this.channel = telepathChannel
    this.requestId = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER / 2))
  }

  async createNewKeyPair () {
    const request = this.createRequest('createEncryptionKeyPair')
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }
    const tag = response.result
    return tag
  }

  async getPublicKey ({ tag }) {
    const request = this.createRequest('getEncryptionPublicKey', { tag })
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }
    const publicKeyJWK = response.result
    return publicKeyJWK
  }

  async decrypt ({ tag, encryptionData }) {
    const splitEncryptionData = encryptionData.split('.')
    const keyPart = splitEncryptionData[1]
    const encryptedSymmetricalKey = '0x' + base64url.toBuffer(keyPart).toString('hex')
    const request = this.createRequest('decrypt', { tag, cipherText: encryptedSymmetricalKey })
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }
    const symmetricKey = Buffer.from(response.result.slice(2), 'hex')
    const cipherText = base64url.toBuffer(splitEncryptionData[0])
    let nonce = base64url.toBuffer(splitEncryptionData[2])
    return decrypt(cipherText, nonce, symmetricKey, 'text')
  }

  async encrypt ({ tag, plainText }) {
    const publicKeyJWK = await this.getPublicKey({ tag })
    const signedN = base64url.toBuffer(publicKeyJWK.n)
    const unsignedN = Buffer.concat([Buffer.from([0]), signedN])
    const n = new forge.jsbn.BigInteger(unsignedN, 256)
    const signedE = base64url.toBuffer(publicKeyJWK.e)
    const unsignedE = Buffer.concat([Buffer.from([0]), signedE])
    const e = new forge.jsbn.BigInteger(unsignedE, 256)
    const publicKey = forge.pki.setRsaPublicKey(n, e)
    const symmetricKey = await this.createRandomKey()
    const nonce = await random(await nonceSize())
    const cipherText = await encrypt(plainText, nonce, symmetricKey)

    const encryptedSymmetricKey = Buffer.from(
      publicKey.encrypt(
        Buffer.from(symmetricKey).toString('binary'),
        'RSA-OAEP'
      ),
      'binary'
    )

    return (
      base64url.encode(cipherText) + '.' +
      base64url.encode(encryptedSymmetricKey) + '.' +
      base64url.encode(nonce)
    )
  }

  createRequest (method, params) {
    return {
      jsonrpc: '2.0',
      id: this.nextRequestId(),
      method,
      params
    }
  }

  nextRequestId () {
    return this.requestId++
  }

  async createRandomKey () {
    return random(await keySize())
  }
}

export { CogitoEncryption }
