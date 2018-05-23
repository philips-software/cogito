import { generatePrivateKey, privateKeyToAddress, sign, keccak256 } from './primitives'
import { issue, accept, verify } from './attestations'

describe('attestations', () => {
  const issuerKey = generatePrivateKey()
  const subjectKey = generatePrivateKey()
  const issuer = privateKeyToAddress(issuerKey)
  const subject = privateKeyToAddress(subjectKey)
  const attribute = 'email:bob@example.com'

  describe('issuing', () => {
    let protoAttestation

    beforeEach(() => {
      protoAttestation = issue(attribute, issuerKey)
    })

    it('returns the correct issuer', () => {
      expect(protoAttestation.issuer).toBe(issuer)
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
      expect(signature).toEqual(sign(issuingHash, issuerKey))
    })
  })

  describe('accepting', () => {
    let protoAttestation
    let attestation

    beforeEach(() => {
      protoAttestation = issue(attribute, issuerKey)
      attestation = accept(protoAttestation, subjectKey)
    })

    it('does not return the attestation key', () => {
      expect(attestation.attestationKey).not.toBeDefined()
    })

    it('returns the issuer', () => {
      expect(attestation.issuer).toBe(issuer)
    })

    it('returns the correct subject', () => {
      expect(attestation.subject).toBe(subject)
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
      const subjectHash = keccak256(subject)
      const attestationSignature = sign(subjectHash, attestationKey)
      expect(attestation.attestationSignature).toEqual(attestationSignature)
    })

    it('returns the correct accepting signature', () => {
      const acceptingHash = keccak256(attribute)
      const acceptingSignature = sign(acceptingHash, subjectKey)
      expect(attestation.acceptingSignature).toEqual(acceptingSignature)
    })
  })

  describe('verifying', () => {
    let protoAttestation
    let attestation

    beforeEach(() => {
      protoAttestation = issue(attribute, issuerKey)
      attestation = accept(protoAttestation, subjectKey)
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
      const wrongAttestation = accept(wrongProtoAttestation, subjectKey)
      expect(verify(wrongAttestation)).toBeFalsy()
    })
  })
})
