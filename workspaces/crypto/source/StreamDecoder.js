import sodium from 'libsodium-wrappers'

class StreamDecoder {
  constructor ({key, header}) {
    this.state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, key)
  }

  pull (cipherText) {
    return sodium.crypto_secretstream_xchacha20poly1305_pull(this.state, cipherText)
  }
}

export { StreamDecoder }
