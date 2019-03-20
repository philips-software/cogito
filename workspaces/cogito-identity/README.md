# @cogitojs/cogito-identity

Retrieve the username or Ethereum address of the connected Cogito user. This
requires that a [Telepath][telepath] connection with the user's Cogito mobile
app has already been set up. When setting up this connection, the user choses
which identity to associate. You can only retrieve the details of this
identity.

## Usage

Add `@cogitojs/cogito-identity` as a dependency:

```bash
$ yarn add `@cogitojs/cogito-identity`
```

The example below shows how to use [telepath] and `CogitoIdentity` in order to
retrieve the user identity properties:

```javascript
import { Telepath } from '@cogitojs/telepath-js'
import { CogitoIdentity } from '@cogitojs/cogito-identity'

const telepath = new Telepath('https://telepath.cogito.mobi')
const channel = await telepath.createChannel({ appName: 'Tutorial' })

const requestedProperties = [
  CogitoIdentity.Property.EthereumAddress,
  CogitoIdentity.Property.Username
]
const cogitoIdentity = new CogitoIdentity({ channel })
const info = await cogitoIdentity.getInfo({ properties: requestedProperties })
if (!info) throw new Error('No identity found on the mobile device!')
console.log(info.ethereumAddress, info.username)
```

Currently, `ethereumAddress` and `username` are the only identity attributes
supported by `CogitoIdentity`.

[telepath]: https://cogito.mobi/components/telepath-js
