import sodium from 'libsodium-wrappers'
import { Sodium } from './Sodium'

class StreamEncoder {
  get cryptoMaterial () {
    Sodium.checkSodium()
    return {
      key: this.key,
      header: this.header
    }
  }

  constructor () {
    Sodium.checkSodium()
    this.key = sodium.crypto_secretstream_xchacha20poly1305_keygen()
    const res = sodium.crypto_secretstream_xchacha20poly1305_init_push(this.key)
    this.state = res.state
    this.header = res.header
  }

  push (data) {
    Sodium.checkSodium()
    return sodium.crypto_secretstream_xchacha20poly1305_push(
      this.state,
      data,
      null,
      Sodium.TAG_MESSAGE
    )
  }

  end (data) {
    Sodium.checkSodium()
    return sodium.crypto_secretstream_xchacha20poly1305_push(
      this.state,
      data,
      null,
      Sodium.TAG_FINAL
    )
  }
}

export { StreamEncoder }
