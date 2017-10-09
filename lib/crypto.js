const sodium = require('libsodium-wrappers')

module.exports = {
  random: sodium.randombytes_buf,
  encrypt: sodium.crypto_secretbox_easy,
  decrypt: sodium.crypto_secretbox_open_easy,
  keySize: sodium.crypto_secretbox_KEYBYTES,
  nonceSize: sodium.crypto_secretbox_NONCEBYTES
}
