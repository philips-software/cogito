import { CogitoRequest } from './CogitoRequest'

class CogitoKeyProvider {
  constructor ({ telepathChannel }) {
    this.channel = telepathChannel
  }

  async createNewKeyPair () {
    const request = CogitoRequest.create('createEncryptionKeyPair')
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }
    const tag = response.result
    return tag
  }

  async getPublicKey ({ tag }) {
    const request = CogitoRequest.create('getEncryptionPublicKey', { tag })
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }
    const publicKeyJWK = response.result
    return publicKeyJWK
  }
}

export { CogitoKeyProvider }
