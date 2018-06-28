## `@cogitojs/crypto`

The `@cogitojs/crypto` package provides cryptographic utilities used by other cogito packages.

### Initializing Sodium

Before using them, you have to make sure that Sodium is initialized and ready to use. You do that by using `Sodium` class (also provided by the `@cogitojs/crypto` package):

```javascript
import { Sodium } from '@cogitojs/crypto'

// must be called before you can use any of the sodium functions
await Sodium.wait()
```

You can always check if Sodium is ready by checking value of `Sodium.ready`. It is `true` when Sodium is initialized correctly.

### Using stream encoder and decoder

Stream encoding/decoding is provided by the means of the `StreamEncoder` and `StreamDecoder` classes.

You initialize `StreamEncoder` by calling its constructor:

```javascript
const streamEncoder = new StreamEncoder()
```

Then, you `push` the chunks of data to be encrypted one by one, calling `end` for the last data chunk.

```javascript
const chunk1 = Uint8Array.from({length: 10}, (v, k) => k)
console.log(`chunk1=[${chunk1}]`) // [0,1,2,3,4,5,6,7,8,9]
const chunk2 = Uint8Array.from({length: 10}, (v, k) => k)
console.log(`chunk2=[${chunk2}]`) // [0,1,2,3,4,5,6,7,8,9]

const encrypted1 = streamEncoder.push(chunk1)
// Everytime different output!
// [255,252,110,195,141,98,144,46,132,235,208,156,31,156,18,71,65,202,166,234,145,0,91,170,206,200,41]
console.log(`encrypted1=[${encrypted1}]`)
const encrypted2 = streamEncoder.end(chunk2)
// Everytime different output!
// [48,160,224,222,153,218,1,75,145,208,231,40,184,242,102,58,196,90,154,238,46,53,218,76,163,149,222]
console.log(`encrypted2=[${encrypted2}]`)
```

Now to decrypt, you call constructor of `StreamDecoder` providing it with the crypto material that you retrieved from `StreamEncoder` instance:

```javascript
const cryptoMaterial = streamEncoder.cryptoMaterial
const streamDecoder = new StreamDecoder(cryptoMaterial)
```

Now you pull the decrypted chunks by calling `pull` with encrypted chunk as the argument:

```javascript
const {message: decrypted1, tag: tag1} = streamDecoder.pull(encrypted1)
const {message: decrypted2, tag: tag2} = streamDecoder.pull(encrypted2)

console.log(`decrypted1=[${decrypted1}]`) // [0,1,2,3,4,5,6,7,8,9]
console.log(`tag1=${tag1}`) // 0 
console.log(`decrypted2=[${decrypted2}]`) // [0,1,2,3,4,5,6,7,8,9]
console.log(`tag2=${tag2}`) // 3

expect(decrypted1).toEqual(chunk1)
expect(tag1).toBe(Sodium.TAG_MESSAGE)
expect(decrypted2).toEqual(chunk2)
expect(tag2).toBe(Sodium.TAG_FINAL)
```

The `pull` function returns an object `{message, tag}`. All the tags except for the last one should have value `Sodium.TAG_MESSAGE`. The tag for the last data chunk of the stream should be equal to `Sodium.TAG_FINAL`.

> Please notice, you can only access `Sodium.TAG_MESSAGE` and `Sodium.TAG_FINAL` **after** Sodium has been initialized: so after you called `await Sodium.wait()`.

Below is the complete example you can use as a jest test:

```javascript
describe('Stream Encryption Decryption, () => {
  beforeAll(async () => {
    await Sodium.wait()
  })

  it('can encrypt and decrypt', () => {
    const streamEncoder = new StreamEncoder()

    const chunk1 = Uint8Array.from({length: 10}, (v, k) => k)
    console.log(`chunk1=[${chunk1}]`)
    const chunk2 = Uint8Array.from({length: 10}, (v, k) => k)
    console.log(`chunk2=[${chunk2}]`)

    const encrypted1 = streamEncoder.push(chunk1)
    console.log(`encrypted1=[${encrypted1}]`)
    const encrypted2 = streamEncoder.end(chunk2)
    console.log(`encrypted2=[${encrypted2}]`)

    const cryptoMaterial = streamEncoder.cryptoMaterial
    const streamDecoder = new StreamDecoder(cryptoMaterial)

    const {message: decrypted1, tag: tag1} = streamDecoder.pull(encrypted1)
    const {message: decrypted2, tag: tag2} = streamDecoder.pull(encrypted2)
    console.log(`decrypted1=[${decrypted1}]`)
    console.log(`tag1=${tag1}`)
    console.log(`decrypted2=[${decrypted2}]`)
    console.log(`tag2=${tag2}`)

    expect(decrypted1).toEqual(chunk1)
    expect(tag1).toBe(Sodium.TAG_MESSAGE)
    expect(decrypted2).toEqual(chunk2)
    expect(tag2).toBe(Sodium.TAG_FINAL)
  })
})
```

### Using the tags

If you are not interested in validating the final tag, you can decide not to use `end` for the final data chunk in encryption, and use `push` for all the data chunks. In the end the only difference between `push` and `end` is the tag value.