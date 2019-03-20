# @cogitojs/cogito-ethereum-react

Provides a React component that allows interaction with smart contracts on an
Ethereum blockchain using the Cogito app. It provides the same functionality as
the [Cogito Ethereum][@cogitojs/cogito-ethereum] package in a React friendly
way.

## Usage

Add `@cogitojs/cogito-ethereum-react` as a dependency:

```bash
yarn add @cogitojs/cogito-ethereum-react
```

and import it:

```javascript
import { CogitoEthereumReact } from '@cogitojs/cogito-ethereum-react'
```

## Props

The `CogitoEthereumReact` component accepts the following props:

| prop name | description  |
|-----------|--------------|
| contractsBlobs  | Array of contracts JSON blobs - see [Working with Contracts] for more details. |
| channelId  | identifier of the Telepath channel. If omitted a new random channel id will be created. |
| channelKey | a symmetric key of the Telepath channel. If omitted a new random key will be created. |
| appName    | the name of the app. Cogito app shows the `appName` when requesting user signature. |
| onTelepathChanged | function to be called when the telepath channel has been updated. Provides an object `{ channelId, channelKey, appName }` as an argument. |
| render     | render prop - a function that will be called every time the component is updated. It provides `{ cogitoWeb3, telepathChannel, contractsProxies, newChannel }` as an argument, where `cogitoWeb3` is an instance of Web3 that uses [CogitoProvider], `telepathChannel` is an instance of [Telepath], and `contractsProxies` is an object holding the references to contracts proxies corresponding to the provided contracts JSON blobs (see [Working with Contracts] for details). `newChannel` is a function to change the current channel to a new one. This function will trigger calling the render prop (or child) function, which means the whole tree below it will be (re)rendered. If this prop is present, it will take precedence over the `children`. |

## Example

The example below illustrates how to use the `CogitoEthereumReact` component:

```jsx
import { CogitoEthereumReact } from '@cogitojs/cogito-ethereum-react'
import { SimpleStorage } from '@cogitojs/demo-app-contracts'

class Main extends React.Component {
  web3IsReady = ({cogitoWeb3, telepathChannel, contractsProxies}) => {
    return (cogitoWeb3 && telepathChannel && contractsProxies.SimpleStorage)
  }

  onTelepathChanged = ({ channelId, channelKey, appName }) => {
    console.log('Telepath channel changed:')
    console.log(`channelId: ${channelId}`)
    console.log(`channelKey: ${channelKey}`)
    console.log(`appName: ${appName}`)
  }

  render () {
    return (
      <CogitoEthereumReact contractsBlobs={[SimpleStorage()]}
        channelId={channelId}
        channelKey={channelKey}
        appName='Cogito Demo App'
        onTelepathChanged={this.onTelepathChanged}
      >
        {web3Props => {
          if (this.web3IsReady(web3Props)) {
            return (
              <div>
                <p>Ready!</p>
                <button onClick={web3Props.newChannel()}>
                  Change channel
                </button>
              </div>
            )
          } else {
            return (
              <p>Please wait...</p>
            )
          }
        }}
      </CogitoEthereumReact>
    )
  }
}

export { Main }
```

If you prefer using `render` prop, the `render` method would look like this:

```jsx
render () {
  return (
    <CogitoEthereumReact contractsBlobs={[SimpleStorage()]}
      channelId={channelId}
      channelKey={channelKey}
      appName='Cogito Demo App'
      onTelepathChanged={this.onTelepathChanged}
      render={web3Props => {
        if (this.web3IsReady(web3Props)) {
          return (
            <div>
              <p>Ready!</p>
              <button onClick={web3Props.newChannel()}>
                Change channel
              </button>
            </div>
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

[@cogitojs/cogito-ethereum]: https://cogito.mobi/components/cogito-ethereum
[Cogito]: https://cogito.mobi/components/cogito-ethereum
[CogitoProvider]: https://cogito.mobi/components/cogito-web3-provider
[Telepath]: https://cogito.mobi/components/telepath-js
[Working with Contracts]: https://cogito.mobi/components/cogito-ethereum#working-with-contracts
