import crypto from 'crypto'
import eth from 'ethereumjs-util'

export function generatePrivateKey () {
  let result
  do {
    result = crypto.randomBytes(32)
  } while (!eth.isValidPrivate(result))
  return eth.bufferToHex(result)
}

export function privateKeyToAddress (privateKey) {
  return eth.bufferToHex(eth.privateToAddress(eth.toBuffer(privateKey)))
}

export function keccak256 (...elements) {
  return eth.sha3(Buffer.concat(elements.map(eth.toBuffer)))
}

export function sign (hash, privateKey) {
  const signature = eth.ecsign(hash, eth.toBuffer(privateKey))
  return {
    v: signature.v,
    r: eth.bufferToHex(signature.r),
    s: eth.bufferToHex(signature.s)
  }
}

export function recover (hash, signature) {
  const v = signature.v
  const r = eth.toBuffer(signature.r)
  const s = eth.toBuffer(signature.s)
  const publicKey = eth.ecrecover(hash, v, r, s)
  return eth.bufferToHex(eth.pubToAddress(publicKey))
}
