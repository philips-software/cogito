import sodium from 'libsodium-wrappers'
import { Sodium } from './Sodium'

class StreamEncoder {
  get cryptoMaterial () {
    return {
      key: this.key,
      header: this.header
    }
  }

  constructor () {
    this.key = sodium.crypto_secretstream_xchacha20poly1305_keygen()
    const res = sodium.crypto_secretstream_xchacha20poly1305_init_push(this.key)
    this.state = res.state
    this.header = res.header
  }

  push (data) {
    return sodium.crypto_secretstream_xchacha20poly1305_push(
      this.state,
      data,
      null,
      Sodium.TAG_MESSAGE
    )
  }

  end (data) {
    return sodium.crypto_secretstream_xchacha20poly1305_push(
      this.state,
      data,
      null,
      Sodium.TAG_FINAL
    )
  }
}

export { StreamEncoder }
