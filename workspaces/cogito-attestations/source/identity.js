import { generatePrivateKey, privateKeyToAddress, sign } from './primitives'

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

  sign (hash) {
    return sign(hash, this.privateKey)
  }

  toString () {
    return JSON.stringify(this)
  }
}
