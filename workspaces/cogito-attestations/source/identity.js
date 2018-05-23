import { generatePrivateKey, privateKeyToAddress } from './primitives'

export class Identity {
  constructor (string = undefined) {
    if (string) {
      const deserialized = JSON.parse(string)
      this.privateKey = deserialized.privateKey
      this.address = deserialized.address
    } else {
      this.privateKey = generatePrivateKey()
      this.address = privateKeyToAddress(this.privateKey)
    }
  }

  toString () {
    return JSON.stringify(this)
  }
}
