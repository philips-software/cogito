# @cogitojs/cogito-identity

`@cogitojs/cogito-identity` allows retrieving identity information over [telepath] (e.g. from a Cogito app).

## Usage

Add `@cogitojs/cogito-identity` as a dependency:

```bash
$ yarn add `@cogitojs/cogito-identity`
```

The example below shows how to use telepath and `CogitoIdentity` in order to retrieve the user identity properties:

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

Currently, `ethereumAddress` and `username` are the only identity attributes supported
by `CogitoIdentity`.

[telepath]: https://cogito.mobi/components/telepath-js
