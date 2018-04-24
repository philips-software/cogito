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
    const request = this.createRequest('getEncryptionPublicKey', [{ tag }])
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }
    const publicKeyPEM = response.result
    return publicKeyPEM
  }

  async decrypt ({ tag, encryptionData }) {
    const splitEncryptionData = encryptionData.split('.')
    const keyPart = splitEncryptionData[1]
    const encryptedSymmetricalKey = base64url.decode(keyPart)
    const request = this.createRequest('decrypt', [{ tag, cipherText: encryptedSymmetricalKey }])
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error)
    }
    const symmetricalKey = response.result
    const cipherText = base64url.decode(splitEncryptionData[0])
    const nonce = base64url.decode(splitEncryptionData[2])
    const plainText = await decrypt(cipherText, nonce, symmetricalKey)
    return plainText
  }

  async encrypt ({ tag, plainText }) {
    const publicKeyPEM = await this.getPublicKey({ tag })
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPEM)

    const symmetricalKey = await this.createRandomKey()
    const nonce = await random(await nonceSize())
    const cipherText = await encrypt(plainText, nonce, symmetricalKey)

    const encryptedKey = publicKey.encrypt(symmetricalKey, 'RSA-OAEP')

    const cipherTextPart = base64url.encode(cipherText)
    const keyPart = base64url.encode(encryptedKey)
    const noncePart = base64url.encode(nonce)
    return cipherTextPart + '.' + keyPart + '.' + noncePart
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
