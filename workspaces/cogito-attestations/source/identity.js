import { generatePrivateKey, privateKeyToAddress, sign, recover, keccak256 } from './primitives'

export class Identity {
  constructor (argument = undefined) {
    switch (typeof argument) {
      case 'string':
        const deserialized = JSON.parse(argument)
        this.privateKey = deserialized.privateKey
        this.address = deserialized.address
        break
      case 'function':
        this.signingFunction = argument
        this.address = deriveAddressFromSigningFunction(argument)
        break
      default:
        this.privateKey = generatePrivateKey()
        this.address = privateKeyToAddress(this.privateKey)
    }
  }

  sign (hash) {
    if (this.signingFunction) {
      return this.signingFunction(hash)
    } else {
      return sign(hash, this.privateKey)
    }
  }

  toString () {
    return JSON.stringify(this)
  }
}

function deriveAddressFromSigningFunction (signingFunction) {
  const hash = keccak256('')
  const signature = signingFunction(hash)
  const address = recover(hash, signature)
  return address
}
