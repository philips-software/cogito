# @cogitojs/cogito-encryption

Enables end-to-end encryption between users without having to worry about key
management. Encryption keys are stored in the Cogito mobile app on the users'
phones. The private keys never leave the user's phone.

# Usage

Add `@cogitojs/cogito-encryption` as a dependency:

```bash
$ yarn add cogitojs/cogito-encryption
```

The example below shows how to use [telepath] and Cogito Encryption to create a
new public/private keypair.

```javascript
import { Telepath } from '@cogitojs/telepath-js'
import { CogitoKeyProvider } from '@cogitojs/cogito-encryption'

const telepath = new Telepath('https://telepath.cogito.mobi')
const telepathChannel = await telepath.createChannel({ appName: 'Tutorial' })

const keyProvider = new CogitoKeyProvider({ telepathChannel })
const tag = await cogitoKeyProvider.createNewKeyPair()
```

Each keypair has a unique identifier called a tag. Once a keypair has been
created, you can retrieve the public key and use it to encrypt some data:

```javascript
import { CogitoEncryption } from '@cogitojs/telepath-js'

const publicKey = await cogitoKeyProvider.getPublicKey({ tag })

const encryption = new CogitoEncryption({ telepathChannel })
const cipherText = await encryption.encrypt({
  jsonWebKey: publicKey,
  plainText: 'a secret'
})
```

You can request decryption by the Cogito mobile app. Note that it is not
possible to retrieve the private key. Decryption can only happen by the Cogito
mobile app after the user has consented.

```javascript
const plainText = await encryption.decrypt({ tag, encryptionData: cipherText })
```

[telepath]: https://cogito.mobi/components/telepath-js
