# @cogitojs/cogito

`@cogitojs/cogito` is a high level convenience components that provides a more
declarative way of working with [cogito-web3], [telepath], and [Ethereum contracts].

> `Cogito` currently uses Telepath with a fixed queueing service URL `https://telepath.cogito.mobi`.

## Usage

Add `@cogitojs/cogito` as a dependency

```bash
$ yarn add `@cogitojs/cogito`
```

`@cogitojs/cogito` aims at making working with [cogito-web3], [telepath], and [Ethereum contracts] easier. Using `@cogitojs/cogito` you do not have know all the details about web3 providers, cogito-web3, and telepath in order to setup a working cogito ecosystem.

Before we learn how to use `Cogito`, we need first make sure we have a good understanding how Cogito looks the Ethereum contracts.

## Working with Contracts

Developers working with Ethereum contract often use a convenience package `truffle-contract`.
To get an instance of a contract you first import `truffle-contract`. What you will get from importing `truffle-contract` is a function that takes a contract definition as an argument and returns a proxy object that you can use to interact with your contract. Before you can do that, however, you still need to set the provider on the returned proxy object:

```javascript
import Web3 from 'web3'
import initContract from 'truffle-contract'
import simpleStorage from 'contracts/SimpleStorage.json'

const providerUrl = 'http://localhost:9545' // example for the local development
const provider = new Web3.providers.HttpProvider(providerUrl)
const web3 = new Web3(provider)
const contract = initContract(simpleStorage)
contract.setProvider(provider)
// or if you got web3 already initialized
contract.setProvider(web3.currentProvider)
```

To get the actual instance of the contract, you can either request the *deployed* version that will
return an instance of the contract deployed at the default address managed by the contract itself, *or*
a *raw* version for which you can request an instance of the contract *at* a specific address. The
*deployed* contracts are often used as a *facade* that represents a fixed entry point to some more
complex functionality. When you call methods of the *deployed* contracts, they often emit events
carrying addresses of other contract instances created as a result of the method invocation. In order to
get a grip on those contract instances, you need to be able to call the `at` method of the contract
proxy object.

The *raw* representation is therefore more versatile, because you can either request a *deployed*
version by calling `deployed()` method on the proxy object, or you can call `at(address)` to get
an instance at a given `address`.

`Cogito` allows you to choose which contracts you would like to have returned as *deployed* contracts and which ones as *raw* contracts. Here is an example:

```javascript
import dataStore from 'contracts/DataStore.json'
import dataRequest from 'contracts/DataRequest.json'
import dataResponse from 'contracts/DataResponse.json'

const contractsInfo = {
  deployedContractsInfo: [
    { contractName: 'dataStore', contractDefinition: dataStore }
  ],
  rawContractsInfo: [
    { contractName: 'dataRequest', contractDefinition: dataRequest },
    { contractName: 'dataResponse', contractDefinition: dataResponse }
  ]
}
```

In the example above, we see that `dataStore` is requested to be a *deployed* version, while `dataRequest` and `dataResponse` are specified to be returned as *raw* instances.

## Creating an instance of Cogito

`@cogitojs/cogito` provides one top-level abstraction: the `Cogito` class. The constructor of the
`Cogito` class takes the description of the contracts as an input. Following on the example we show
in the previous section:

```javascript
const cogito = new Cogito(contractsInfo)
```

Now, in order to retrieve a properly set web3 object that uses a Cogito
Provider over a new Telepath channel, we call:

```javascript
const {web3, channel, contracts} = await cogito.update({ appName: 'Demo App' })
```

`web3` is an instance of web3 with a Cogito Provider over a new Telepath `channel` and `contracts`
is an object holding the references to either deployed contracts or the raw proxies:

```javascript
contracts.dataStore    // deployed
contracts.dataRequest  // raw
contracts.dataResponse // raw
```

The deployed version is the ready to use *deployed* contract. For the raw versions you can either
request a deployed version by calling e.g. `contracts.dataRequest.deployed()` or a version at
the specific `address` by calling e.g. `contracts.dataRequest.at(address)`.

The returned `channel` object is an instance of a `JsonRpcChannel` that is returned by the
`createChannel` method of the instance of `Telepath`. It provides the channel id as `channel.id`, 
the channel key as `channel.key`, allows to send a JSON-RPC `request` using `send(request)`, and
provides a convenience method to get the telepath connection url via `channel.createConnectUrl()`.
This connection url can be use to generate the QR-Code to be scanned by the Cogito app in order
to establish a secure connection with the JavaScript client. To learn more about Telepath, connection URLs, and QR-Codes, please refer to the documentation of the [telepath-js] package.

Finally, if you would like to use a previously created Telepath channel with given `id` and `key`,
you can do the following:

```javascript
const {web3, channel, contracts} = await cogito.update({
  channelId: id,
  channelKey: key,
  appName: 'Demo App'
})
```

This will reuse an existing Telepath channel.

[Web3]: https://github.com/ethereum/web3.js
[cogito-web3]: https://cogito.mobi/components/cogito-web3
[telepath]: https://cogito.mobi/components/telepath-js
[telepath-js]: https://cogito.mobi/components/telepath-js
[Ethereum contracts]: http://www.ethdocs.org/en/latest/contracts-and-transactions/index.html
