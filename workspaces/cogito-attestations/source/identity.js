import { generatePrivateKey, privateKeyToAddress } from './primitives'

export class Identity {
  constructor () {
    this.privateKey = generatePrivateKey()
    this.address = privateKeyToAddress(this.privateKey)
  }

  toString () {
    return JSON.stringify(this)
  }
}
