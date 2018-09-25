# @cogitojs/cogito-web3

`@cogitojs/cogito-web3` provides a means to intercept some of the standard
[Web3] requests and redirect them to the Cogito mobile app using the [telepath] channel.

## Usage

Add `@cogitojs/cogito-web3` as your dependency:

```bash
$ yarn add @cogitojs/cogito-web3
```

[Web3] delegates the actual sending of the requests to the so called providers. 
A valid web3 provider is required to provide one function: `send(payload, callback)`.
It often provides other functions (e.g. allowing web3 to poll for the connection status)
but in principle, the `send` function is the one that is strictly required. `@cogitojs/cogito-web3`
provides such a provider as its only top-level abstraction: `CogitoProvider`.

`CogitoProvider` requires two arguments when creating: the original provider and the telepath channel. The example below shows how to use `CogitoProvider` with `Web3` and `Telepath`:

```javascript
import { Telepath } from '@cogitojs/telepath-js'
import Web3 from 'web3'
import { CogitoProvider } from '@cogitojs/cogito-web3'

const telepath = new Telepath('https://telepath.cogito.mobi')
const telepathChannel = await telepath.createChannel({ appName: 'Tutorial' })

const providerUrl = 'http://localhost:9545' // example for the local development
const originalProvider = new Web3.providers.HttpProvider(providerUrl)
const web3 = new Web3(
  new CogitoProvider({ originalProvider, telepathChannel })
)
```

From now on, `CogitoProvider` will check if the incoming request should be redirected to
telepath (and then in turn to e.g. the Cogito mobile app) or if it should be handed over to
the original provider.

Currently, `CogitoProvider` redirects two types of requests to telepath: [eth_accounts] and
[eth_sendTransaction]. All other requests are forwarded to the original provider.


[Web3]: https://github.com/ethereum/web3.js
[telepath]: https://cogito.mobi/components/telepath-js
[eth_accounts]: https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethaccounts
[eth_sendTransaction]: https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsendtransaction
