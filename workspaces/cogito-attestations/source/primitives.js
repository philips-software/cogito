import crypto from 'crypto'
import {
  isValidPrivate, privateToAddress, pubToAddress,
  bufferToHex, toBuffer,
  sha3, ecsign, ecrecover
} from 'ethereumjs-util'

export function generatePrivateKey () {
  let result
  do {
    result = crypto.randomBytes(32)
  } while (!isValidPrivate(result))
  return bufferToHex(result)
}

export function privateKeyToAddress (privateKey) {
  return bufferToHex(privateToAddress(toBuffer(privateKey)))
}

export function keccak256 (...elements) {
  return sha3(Buffer.concat(elements.map(toBuffer)))
}

export function sign (hash, privateKey) {
  const signature = ecsign(hash, toBuffer(privateKey))
  return {
    v: signature.v,
    r: bufferToHex(signature.r),
    s: bufferToHex(signature.s)
  }
}

export function recover (hash, signature) {
  const v = signature.v
  const r = toBuffer(signature.r)
  const s = toBuffer(signature.s)
  const publicKey = ecrecover(hash, v, r, s)
  return bufferToHex(pubToAddress(publicKey))
}
