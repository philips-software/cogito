import forge from 'node-forge'

export const rsaGenerateKeyPair = ({ bits }) => {
  return forge.pki.rsa.generateKeyPair({ bits })
}

export const rsaDecrypt = ({ privateKey, cipherText }) => {
  const forgeCipherText = Buffer.from(cipherText).toString('binary')
  const forgePlainText = privateKey.decrypt(forgeCipherText, 'RSA-OAEP')
  const plainText = Buffer.from(forgePlainText, 'binary')
  return plainText
}

export const rsaEncrypt = ({ publicKey, plainText }) => {
  const forgePlainText = Buffer.from(plainText).toString('binary')
  const forgeCipherText = publicKey.encrypt(forgePlainText, 'RSA-OAEP')
  const cipherText = Buffer.from(forgeCipherText, 'binary')
  return cipherText
}

export const rsaCreatePublicKey = ({ n, e }) => {
  const forgeN = new forge.jsbn.BigInteger(n, 256)
  const forgeE = new forge.jsbn.BigInteger(e, 256)
  return forge.pki.setRsaPublicKey(forgeN, forgeE)
}
