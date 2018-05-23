import { generatePrivateKey, privateKeyToAddress, sign, keccak256 } from './primitives'
import { Identity } from './identity'
import { issue, accept, verify } from './attestations'

describe('attestations', () => {
  const issuer = new Identity()
  const subject = new Identity()
  const attribute = 'email:bob@example.com'

  describe('issuing', () => {
    let protoAttestation

    beforeEach(() => {
      protoAttestation = issue(attribute, issuer)
    })

    it('returns the correct issuer', () => {
      expect(protoAttestation.issuer).toBe(issuer.address)
    })

    it('returns the correct attribute', () => {
      expect(protoAttestation.attribute).toBe(attribute)
    })

    it('returns an attestation key', () => {
      expect(protoAttestation.attestationKey).toBeDefined()
    })

    it('returns the correct signature', () => {
      const attestationKey = protoAttestation.attestationKey
      const attestationId = privateKeyToAddress(attestationKey)
      const issuingHash = keccak256(attestationId, attribute)
      const signature = protoAttestation.issuingSignature
      expect(signature).toEqual(sign(issuingHash, issuer.privateKey))
    })
  })

  describe('accepting', () => {
    let protoAttestation
    let attestation

    beforeEach(() => {
      protoAttestation = issue(attribute, issuer)
      attestation = accept(protoAttestation, subject)
    })

    it('does not return the attestation key', () => {
      expect(attestation.attestationKey).not.toBeDefined()
    })

    it('returns the issuer', () => {
      expect(attestation.issuer).toBe(issuer.address)
    })

    it('returns the correct subject', () => {
      expect(attestation.subject).toBe(subject.address)
    })

    it('returns the attribute', () => {
      expect(attestation.attribute).toBe(attribute)
    })

    it('returns the issuing signature', () => {
      const { issuingSignature } = protoAttestation
      expect(attestation.issuingSignature).toBe(issuingSignature)
    })

    it('returns the correct attestation signature', () => {
      const { attestationKey } = protoAttestation
      const subjectHash = keccak256(subject.address)
      const attestationSignature = sign(subjectHash, attestationKey)
      expect(attestation.attestationSignature).toEqual(attestationSignature)
    })

    it('returns the correct accepting signature', () => {
      const acceptingHash = keccak256(attribute)
      const acceptingSignature = sign(acceptingHash, subject.privateKey)
      expect(attestation.acceptingSignature).toEqual(acceptingSignature)
    })
  })

  describe('verifying', () => {
    let protoAttestation
    let attestation

    beforeEach(() => {
      protoAttestation = issue(attribute, issuer)
      attestation = accept(protoAttestation, subject)
    })

    it('accepts a correct attestation', () => {
      expect(verify(attestation)).toBeTruthy()
    })

    it('rejects an attestation with an incorrect subject', () => {
      const wrongSubject = privateKeyToAddress(generatePrivateKey())
      const wrongAttestation = { ...attestation, subject: wrongSubject }
      expect(verify(wrongAttestation)).toBeFalsy()
    })

    it('rejects an attestation with an incorrect attribute', () => {
      const wrongAttestation = { ...attestation, attribute: 'wrong' }
      expect(verify(wrongAttestation)).toBeFalsy()
    })

    it('rejects an attestation with an incorrect issuer', () => {
      const wrongIssuer = privateKeyToAddress(generatePrivateKey())
      const wrongAttestation = { ...attestation, issuer: wrongIssuer }
      expect(verify(wrongAttestation)).toBeFalsy()
    })

    it('rejects an attestation signed with the wrong attestation key', () => {
      const wrongAttestationKey = generatePrivateKey()
      const wrongProtoAttestation = {
        ...protoAttestation,
        attestationKey: wrongAttestationKey
      }
      const wrongAttestation = accept(wrongProtoAttestation, subject)
      expect(verify(wrongAttestation)).toBeFalsy()
    })
  })
})
