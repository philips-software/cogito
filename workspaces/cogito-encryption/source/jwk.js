import base64url from 'base64url'

export const extractRsaParameters = ({ jsonWebKey }) => {
  // A JSON Web Key contains RSA parameters n and e in the Base64urlUInt-encoded
  // format. Reference: https://tools.ietf.org/html/rfc7518#section-6.3.1

  // Decode base64:
  const UIntN = base64url.toBuffer(jsonWebKey.n)
  const UIntE = base64url.toBuffer(jsonWebKey.e)

  // Convert unsigned integers to signed integers by prepending a 0 byte:
  const IntN = Buffer.concat([Buffer.from([0]), UIntN])
  const IntE = Buffer.concat([Buffer.from([0]), UIntE])

  return { n: IntN, e: IntE }
}
