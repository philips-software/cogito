# @cogitojs/cogito-ethereum

`@cogitojs/cogito-ethereum` is a high level convenience package that provides a
more declarative way of working with [cogito-web3-provider], [telepath], and
[Ethereum contracts].

## Usage

Add `@cogitojs/cogito-ethereum` as a dependency

```bash
$ yarn add `@cogitojs/cogito-ethereum`
```

`@cogitojs/cogito-ethereum` aims at making working with [cogito-web3-provider],
[telepath], and [Ethereum contracts] easier. Using `@cogitojs/cogito-ethereum`
you do not have know all the details about web3 providers,
cogito-web3-provider, and telepath, in order to setup a working cogito
ecosystem.

`@cogitojs/cogito-ethereum`'s main abstraction is `CogitoEthereum`.

Before we learn how to use `CogitoEthereum`, we need first make sure we have a
good understanding how CogitoEthereum handles the Ethereum contracts.

## Working with Contracts

Developers working with Ethereum contract often use a convenience package
`truffle-contract`. To get an instance of a contract you first import
`truffle-contract`. What you will get from importing `truffle-contract` is a
function that takes a contract definition as an argument and returns a proxy
object that you can use to interact with your contract. Before you can do that,
however, you still need to set the provider on the returned proxy object:

```javascript
import Web3 from 'web3'
import initContract from 'truffle-contract'
import { SimpleStorage } from '@cogitojs/demo-app-contracts'

const providerUrl = 'http://localhost:9545' // example for the local development
const provider = new Web3.providers.HttpProvider(providerUrl)
const web3 = new Web3(provider)
const contractProxy = initContract(SimpleStorage())
contractProxy.setProvider(provider)
// or if you got web3 already initialized
contractProxy.setProvider(web3.currentProvider)
```

> Please, note that `@cogitojs/demo-app-contracts` exports a function that
returns the actual contract JSON blob. We could also directly return a
function, but that would make mocking with
`jest.mock('@cogitojs/demo-app-contracts')` not possible. `jest.mock` can only
mock exported functions. This is why in the snipped above we are calling
`SimpleStorage()` instead of just using `SimpleStorage`. In the following
examples we will directly import JSON blobs from JSON files.

To get the actual instance of the contract, you can use one of the proxy
methods: `deployed()`, `at()`, or `new()`. Please refer to the documentation of
[truffle-contract] for more information.


## Creating an instance of CogitoEthereum

`CogitoEtheruem` expects an array of contracts JSON blobs as the first
constructor argument:

```javascript
import DataStoreJSON from 'contracts/DataStore.json'
import DataRequestJSON from 'contracts/DataRequest.json'
import DataResponseJSON from 'contracts/DataResponse.json'
import { CogitoEthereum } from '@cogitojs/cogito-ethereum'

const cogitoEthereum = new CogitoEthereum([ DataStoreJSON, DataRequestJSON, DataResponseJSON ])
```

`CogitoEtheruem` takes care for setting up a new `Web3` instance that uses the
`CogitoProvider` from [@cogitojs/cogito-web3-provider] as the `currentProvider`
(`cogitoWeb3`), the associated telepath channel (`telepathChannel`), and an
object with contract proxies corresponding to each contract JSON blob passed in
the first constructor argument (`contractsProxies`). `cogitoWeb3`,
`telepathChannel`, and `contractsProxies` together are called a *context* and
can be retrieved using `CogitoEthereum` instance method: `getContext`:

```javascript
const {
  cogitoWeb3,
  telepathChannel,
  contractsProxies
} = await cogitoEthereum.getContext({ appName: 'Demo App' })
```

`getContext` expect an object as an argument: `{ channelId, channelKey, appName
}`. If `channelId` and/or `channelKey` are not provided, a new random value
will be created, and the resulting `channelId` and `channelKey` will be used to
create a telepath channel instance. Notice, that the `appName` attribute is
required.

The returned `telepathChannel` attribute refers to an instance of a
`JsonRpcChannel` that is returned by the `createChannel` method of the instance
of `Telepath`. It provides the channel id as `telepathChannel.id`, the channel
key as `telepathChannel.key`, allows to send a JSON-RPC `request` using
`send(request)`, and provides a convenience method to get the telepath
connection url via `telepathChannel.createConnectUrl()`. This connection url
can be use to generate the QR-Code to be scanned by the Cogito app in order to
establish a secure connection with the JavaScript client. To learn more about
Telepath, connection URLs, and QR-Codes, please refer to the documentation of
the [telepath-js] package.

`cogitoWeb3` holds a reference to a valid `Web3` object that uses
`CogitoProvider` as the provider. It means that requests for requesting
Ethereum accounts (`cogitoWeb3.eth.getAccounts()`, see also [eth_accounts]) or
sending Ethereum transactions (`cogitoWeb3.eth.sendTransaction`, see also
[eth_sendTransaction]) will be redirect to the client via associated telepath
channel.

Finally, `contractsProxies` is an object with attributes referring to the
contract proxies corresponding to the provided contract JSON blobs. For
example:

```javascript
const cogitoEthereum = new CogitoEthereum([ DataStore, DataRequest, DataResponse ])
const { contractsProxies } = await cogitoEthereum.getContext({ appName: 'Demo App' })
const { DataStore, DataRequest, DataResponse } = contractsProxies
const dataStoreContractInstance = await DataStore.deployed()
const dataRequestContractInstance = await DataRequest.at(await dataStoreContractInstance.getDataRequest())
const dataResponseContractInstance = await DataResponse.at(await dataStoreContractInstance.getDataResponse())
```

The names of the attributes in the `contractsProxies` object correspond to the
name of the contracts as given by the `contractName` attribute of the
corresponding contract JSON blob.

Finally, `CogitoEthereum` accepts an optional second argument holding the
queuing service url to be used with telepath. The default is
`https://telepath.cogito.mobi`.

[truffle-contract]: https://github.com/trufflesuite/truffle/tree/develop/packages/truffle-contract
[Web3]: https://github.com/ethereum/web3.js
[cogito-web3-provider]: https://cogito.mobi/components/cogito-web3-provider
[@cogitojs/cogito-web3-provider]: https://cogito.mobi/components/cogito-web3-provider
[telepath]: https://cogito.mobi/components/telepath-js
[telepath-js]: https://cogito.mobi/components/telepath-js
[Ethereum contracts]: http://www.ethdocs.org/en/latest/contracts-and-transactions/index.html
[eth_accounts]: https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_accounts
[eth_sendtransaction]: https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction
