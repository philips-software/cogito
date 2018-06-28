import sodium from 'libsodium-wrappers'
import { Sodium } from './Sodium'

class StreamDecoder {
  constructor ({key, header}) {
    Sodium.checkSodium()
    this.state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, key)
  }

  pull (cipherText) {
    Sodium.checkSodium()
    return sodium.crypto_secretstream_xchacha20poly1305_pull(this.state, cipherText)
  }
}

export { StreamDecoder }
