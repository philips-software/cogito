import sodium from 'libsodium-wrappers'

class StreamEncoder {
  sodiumReady = false

  async waitUntilReady () {
    if (!this.sodiumReady) {
      await sodium.ready
      this.sodiumReady = true
    }
  }

  async prepare () {
    await this.waitUntilReady()

    const key = sodium.crypto_secretstream_xchacha20poly1305_keygen()
    const res = sodium.crypto_secretstream_xchacha20poly1305_init_push(key)
    this.state = res.state
    this.header = res.header

    return {key, header: this.header}
  }

  push (data) {
    return sodium.crypto_secretstream_xchacha20poly1305_push(
      this.state,
      data,
      null,
      sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE
    )
  }

  end (data) {
    return sodium.crypto_secretstream_xchacha20poly1305_push(
      this.state,
      data,
      null,
      sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
    )
  }
}

export { StreamEncoder }
