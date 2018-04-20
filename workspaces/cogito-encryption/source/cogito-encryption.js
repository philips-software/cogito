class CogitoEncryption {
  constructor ({ telepathChannel }) {
    this.channel = telepathChannel
    this.requestId = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER / 2))
  }

  async createNewKeyPair () {
    const request = {
      jsonrpc: '2.0',
      id: this.nextRequestId(),
      method: 'createEncryptionKeyPair'
    }
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }
    const tag = response.result
    return tag
  }

  async getPublicKey ({ tag }) {
    const request = {
      jsonrpc: '2.0',
      id: this.nextRequestId(),
      method: 'getEncryptionPublicKey',
      params: [{ tag }]
    }
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }
    const publicKey = response.result
    return publicKey
  }

  async decrypt ({ tag, cipherText }) {
    const request = {
      jsonrpc: '2.0',
      id: this.nextRequestId(),
      method: 'decrypt',
      params: [{ tag, cipherText }]
    }
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error('some error')
    }
    const plainText = response.result
    return plainText
  }

  nextRequestId () {
    return this.requestId++
  }
}

export { CogitoEncryption }
