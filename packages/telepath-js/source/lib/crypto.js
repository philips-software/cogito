const sodium = require('libsodium-wrappers')
let ready = false

async function waitUntilReady () {
  if (!ready) {
    await sodium.ready
    ready = true
  }
}

async function random (...args) {
  await waitUntilReady()
  return sodium.randombytes_buf(...args)
}

async function encrypt (...args) {
  await waitUntilReady()
  return sodium.crypto_secretbox_easy(...args)
}

async function decrypt (...args) {
  await waitUntilReady()
  return sodium.crypto_secretbox_open_easy(...args)
}

async function keySize () {
  await waitUntilReady()
  return sodium.crypto_secretbox_KEYBYTES
}

async function nonceSize () {
  await waitUntilReady()
  return sodium.crypto_secretbox_NONCEBYTES
}

module.exports = { random, encrypt, decrypt, keySize, nonceSize }
