export class CogitoKeyProvider {
  async createNewKeyPair () {
    return createNewKeyPairMock()
  }

  getPublicKey ({ tag }) {
    getPublicKeyMock({ tag })
  }
}

export class CogitoEncryption {
  encrypt ({ jsonWebKey, plainText }) {
  }
}

export const createNewKeyPairMock = jest.fn()
export const getPublicKeyMock = jest.fn()
