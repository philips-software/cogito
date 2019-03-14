export class CogitoKeyProvider {
  async createNewKeyPair () {
    return createNewKeyPairMock()
  }

  async getPublicKey ({ tag }) {
    return getPublicKeyMock({ tag })
  }
}

export class CogitoEncryption {
  async encrypt ({ jsonWebKey, plainText }) {
    return encryptMock({ jsonWebKey, plainText })
  }
}

export const createNewKeyPairMock = jest.fn()
export const getPublicKeyMock = jest.fn()
export const encryptMock = jest.fn()
