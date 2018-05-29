if (!this.crypto.getRandomValues) {
    const crypto = this.crypto
    crypto.getRandomValues = function(array) {
        const randomValues = crypto.randomBytes(array.byteLength)
        array.set(new Uint8Array(randomValues))
    }
}
