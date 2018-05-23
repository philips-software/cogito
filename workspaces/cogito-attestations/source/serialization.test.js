import base64url from 'base64url'
import { Identity } from './identity'
import { issue, accept } from './attestations'
import { serialize, deserialize } from './serialization'

describe('serialization', () => {
  const issuer = new Identity()
  const subject = new Identity()
  const protoAttestation = issue('some:attribute', issuer)
  const attestation = accept(protoAttestation, subject)

  it('can serialize proto attestations', () => {
    const serialized = serialize(protoAttestation)
    expect(serialized).toEqual(base64url(JSON.stringify(protoAttestation)))
  })

  it('can deserialize proto attestations', () => {
    const deserialized = deserialize(serialize(protoAttestation))
    expect(deserialized).toEqual(protoAttestation)
  })

  it('can serialize attestations', () => {
    const serialized = serialize(attestation)
    expect(serialized).toEqual(base64url(JSON.stringify(attestation)))
  })

  it('can deserialize attestations', () => {
    const deserialized = deserialize(serialize(attestation))
    expect(deserialized).toEqual(attestation)
  })
})
