import { extractRsaParameters } from './jwk'
import { rsaCreatePublicKey } from './rsa'

export const createRsaPublicKey = ({ jsonWebKey }) => {
  const { n, e } = extractRsaParameters({ jsonWebKey })
  return rsaCreatePublicKey({ n, e })
}
