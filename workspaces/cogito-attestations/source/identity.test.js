import { Identity } from './identity'
import { privateKeyToAddress } from './primitives'

describe('identity', () => {
  const identity = new Identity()

  it('has a private key', () => {
    expect(identity.privateKey).toBeDefined()
  })

  it('has a corresponding address', () => {
    const address = privateKeyToAddress(identity.privateKey)
    expect(identity.address).toEqual(address)
  })

  it('generates unique addresses', () => {
    const identity1 = new Identity()
    const identity2 = new Identity()
    expect(identity1.address).not.toEqual(identity2.address)
  })

  it('can be serialized', () => {
    const serialized = `${identity}`
    expect(serialized).toContain(identity.privateKey)
    expect(serialized).toContain(identity.address)
  })

  it('can be deserialized', () => {
    const serialized = `${identity}`
    const deserialized = new Identity(serialized)
    expect(deserialized).toEqual(identity)
  })
})
