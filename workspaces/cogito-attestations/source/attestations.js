import {
  generatePrivateKey, privateKeyToAddress, keccak256, sign, recover
} from './primitives'

export function issue (attribute, issuer) {
  const attestationKey = generatePrivateKey()
  const attestationId = privateKeyToAddress(attestationKey)
  const issuingHash = keccak256(attestationId, attribute)
  const issuingSignature = issuer.sign(issuingHash)
  return ({
    issuer: issuer.address,
    attribute,
    attestationKey,
    issuingSignature
  })
}

export function accept (protoAttestation, subject) {
  const { issuer, attribute, issuingSignature, attestationKey } = protoAttestation
  const subjectHash = keccak256(subject.address)
  const attestationSignature = sign(subjectHash, attestationKey)
  const acceptingHash = keccak256(attribute)
  const acceptingSignature = subject.sign(acceptingHash)
  return ({
    issuer,
    subject: subject.address,
    attribute,
    issuingSignature,
    attestationSignature,
    acceptingSignature
  })
}

export function verify (attestation) {
  const {
    issuer, subject, attribute,
    issuingSignature, attestationSignature, acceptingSignature
  } = attestation
  const subjectHash = keccak256(subject)
  const attestationId = recover(subjectHash, attestationSignature)
  const issuingHash = keccak256(attestationId, attribute)
  const acceptingHash = keccak256(attribute)
  return (
    recover(issuingHash, issuingSignature) === issuer &&
    recover(acceptingHash, acceptingSignature) === subject
  )
}
