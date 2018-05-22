export class AttestationsActions {
  static retrievedAttestation = (attestation) => ({
    type: 'RETRIEVED_ATTESTATION',
    attestation
  })
}
