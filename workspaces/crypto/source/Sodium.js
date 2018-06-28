import sodium from 'libsodium-wrappers'

class Sodium {
  static ready = false

  static async wait () {
    if (!Sodium.ready) {
      await sodium.ready
      Sodium.ready = true
    }
  }

  static get TAG_MESSAGE () {
    return sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE
  }

  static get TAG_FINAL () {
    return sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
  }
}

export { Sodium }
