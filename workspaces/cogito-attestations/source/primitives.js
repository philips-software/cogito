import crypto from 'crypto'
import eth from 'ethereumjs-util'

export function generatePrivateKey () {
  let result
  do {
    result = crypto.randomBytes(32)
  } while (!eth.isValidPrivate(result))
  return result
}

export function privateKeyToAddress (privateKey) {
  return eth.bufferToHex(eth.privateToAddress(privateKey))
}

export function keccak256 (...elements) {
  return eth.sha3(Buffer.concat(elements.map(eth.toBuffer)))
}

export function sign (hash, privateKey) {
  const signature = eth.ecsign(hash, privateKey)
  return {
    v: signature.v,
    r: eth.bufferToHex(signature.r),
    s: eth.bufferToHex(signature.s)
  }
}
