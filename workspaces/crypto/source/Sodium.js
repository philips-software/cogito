import sodium from 'libsodium-wrappers'

class Sodium {
  static async wait () {
    if (!Sodium.ready) {
      await sodium.ready
      Sodium.ready = true
    }
  }

  static checkSodium () {
    if (!Sodium.ready) {
      throw new Error('Sodium not initialized! Did you forget to call `await Sodium.wait()`?')
    }
  }

  static get TAG_MESSAGE () {
    Sodium.checkSodium()
    return sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE
  }

  static get TAG_FINAL () {
    Sodium.checkSodium()
    return sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
  }
}

Sodium.ready = false

export { Sodium }
