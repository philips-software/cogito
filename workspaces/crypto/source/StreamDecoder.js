import sodium from 'libsodium-wrappers'

class StreamDecoder {
  sodiumReady = false

  async waitUntilReady () {
    if (!this.sodiumReady) {
      await sodium.ready
      this.sodiumReady = true
    }
  }

  async prepare ({key, header}) {
    await this.waitUntilReady()

    this.state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, key)
  }

  pull (cipherText) {
    return sodium.crypto_secretstream_xchacha20poly1305_pull(this.state, cipherText).message
  }
}

export { StreamDecoder }
