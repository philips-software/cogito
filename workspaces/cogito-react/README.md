---
path: /components/cogito-react
title: Cogito React
tag: component
---

`@cogitojs/cogito-react` is a React version [@cogitojs/cogito].

## Usage

Add `@cogitojs/cogito-react` as a dependency:

```bash
yarn add @cogitojs/cogito-react
```

and import it:

```javascript
import { CogitoReact } from '@cogitojs/cogito-react'
```

## Props

The `CogitoReact` component accepts the following props:

| prop name | description  |
|-----------|--------------|
| contracts  | Contract information - see [Working with Contracts] below. |
| channelId  | identifier of the Telepath channel. If omitted a new random channel id will be created. |
| channelKey | a symmetric key of the Telepath channel. If omitted a new random key will be created. |
| appName    | the name of the app. Cogito app shows the `appName` when requesting user signature. |
| onTelepathChanged | function to be called when the telepath channel has been updated. Provides an object `{ channelId, channelKey, appName }` as an argument. |
| render     | render prop - a function that will be called every time the component is updated. It provides `{ web3, channel, contracts }` as an argument, where `web3` is an instance of Web3 that uses [CogitoProvider], `channel` is an instance of [Telepath], and `contracts` is an object holding the references to either deployed contracts or the raw proxies (see [Working with Contracts] below). If this prop is present, it will take precedence of the `childrens`. | 

## Example

The example below illustrates how to use the `CogitoReact` component:

```jsx
class Main extends React.Component {
  web3IsReady = ({web3, channel, contracts}) => {
    return (web3 && channel && contracts)
  }

  onTelepathChanged = ({ channelId, channelKey, appName }) => {
    console.log('Telepath channel changed:')
    console.log(`channelId: ${channelId}`)
    console.log(`channelKey: ${channelKey}`)
    console.log(`appName: ${appName}`)
  }

  render () {
    return (
      <CogitoReact contracts={contractsInfo}
        channelId={channelId}
        channelKey={channelKey}
        appName='Cogito Demo App'
        onTelepathChanged={this.onTelepathChanged}
      >
        {web3Props => {
          if (this.web3IsReady(web3Props)) {
            return (
              <p>Ready!</p>
            )
          } else {
            return (
              <p>Please wait...</p>
            )
          }
        }}
      </CogitoReact>
    )
  }
}

export { Main }
```

If you prefer using `render` prop, the `render` method would look like this:

```jsx
render () {
  return (
    <CogitoReact contracts={contractsInfo}
      channelId={channelId}
      channelKey={channelKey}
      appName='Cogito Demo App'
      onTelepathChanged={this.onTelepathChanged}
      render={web3Props => {
        if (this.web3IsReady(web3Props)) {
          return (
            <p>Ready!</p>
          )
        } else {
          return (
            <p>Please wait...</p>
          )
        }
      }} />
  )
}
```

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
carrying addresses of other contract instances created as result of the method invocation. In order to
get a grip on those contract instances, you need to be able to call the `at` method of the contract
proxy object.

The *raw* representation is therefore more versatile, because you can either request a *deployed*
version by calling `deployed()` method on the proxy object, or you can call `at(address)` to get
an instance at a given `address`.

You can choose which contracts you would like to have returned as *deployed* contracts and which ones as *raw* contracts. Here is an example:

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

`CogitoReact` (and also [Cogito]) processes this input structure and returns an object holding the references to either deployed contracts or the raw proxies:

```javascript
contracts.dataStore    // deployed
contracts.dataRequest  // raw
contracts.dataResponse // raw
```

[@cogitojs/cogito]: /components/cogito
[Cogito]: /components/cogito
[CogitoProvider]: /components/cogito-web3
[Telepath]: /components/telepath-js
[Working with Contracts]: #working-with-contracts
