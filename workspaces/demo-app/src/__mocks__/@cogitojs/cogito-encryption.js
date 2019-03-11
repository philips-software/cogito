export class CogitoKeyProvider {
  createNewKeyPair () {
    createNewKeyPairMock()
  }
}

export class CogitoEncryption {

}

export const createNewKeyPairMock = jest.fn()
