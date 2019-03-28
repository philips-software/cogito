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

  async decrypt ({ tag, encryptionData }) {
    return decryptMock({ tag, encryptionData })
  }
}

export const createNewKeyPairMock = jest.fn()
export const getPublicKeyMock = jest.fn()
export const encryptMock = jest.fn()
export const decryptMock = jest.fn()
