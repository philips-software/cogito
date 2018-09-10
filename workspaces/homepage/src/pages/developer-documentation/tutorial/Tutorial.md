---
title: Tutorial
path: /developer-documentation/tutorial
tag: developer-documentation
---

This tutorial teaches you how to add simple and safe signing of Ethereum
transactions to your web app. We will assume basic knowledge of [Node.js][1]
and the [Truffle][2] development environment for Ethereum.

Project setup
-------------

Please ensure that you have a working [Node.js][1] environment and that you
installed [Truffle][2]. We will use the [Yarn][4] package manager instead of the
standard Node package manager, so you might want to install that as well.

We will setup our project using the [Truffle Create React App][3] box,
which will give us a React web app with support for Solidity smart contracts:

    mkdir cogito-tutorial
    cd cogito-tutorial
    truffle unbox Charterhouse/truffle-create-react-app

After issuing these commands your terminal should resemble:

![unbox output](./images/TruffleUnbox.png)

Running the web app
-------------------

You can now start an Ethereum test environment by opening the Truffle
development console:

    truffle develop

Which should give you a prompt like this:

![develop prompt](./images/TruffleDevelop.png)

Our project includes an example smart contract in `contracts/SimpleStorage.sol`.
Deploy this smart contract now by executing the following command in the
Truffle development console:

    migrate

![migrate output](./images/TruffleMigrate.png)

Now that we have our Ethereum test environment with smart contracts setup, we
can start a local server to test our web app. In a separate terminal issue the
following commands:

    cd web-app
    yarn start

![react server output](./images/ReactServer.png)

You should now be able to browse to http://localhost:3000, and see the webapp in
action.

![web app](./images/WebApp.png)

When you play around with the web app you'll notice that you can interact with
the smart contract without having to sign any transactions. This happens because
we are currently using a dummy account that is provided by the Truffle
development environment. In the next section we will add proper transaction
signing using the Cogito app.

Cogito integration
------------------

To enable signing with the Cogito app, we'll go through these steps:

1. Create a Telepath channel for communication between the web app and the
   Cogito mobile app.
2. Display a QR code that allows the mobile app to connect.
3. Replace the standard Ethereum Web3 provider with a Cogito specific version.

### Create Telepath channel

The web app and the Cogito mobile app communicate with each other through an
encrypted channel called Telepath. We start by adding the Telepath package to
our project:

    cd web-app
    yarn add @cogitojs/telepath-js libsodium-wrappers

This add the Telepath package and its dependencies to the web app.

We are now ready to dive into the code of the web app. Start by editing the
component that is responsible for loading the Ethereum Web3 provider. It is
located in the `web-app/src/component/web3/Web3.js` file. Import the Telepath
module by adding the following line to the imports:

```javascript
import { Telepath } from '@cogitojs/telepath-js'
```

Now take a look at the following code in the `componentDidMount` function:

```javascript
const web3 = await getWeb3()
const accounts = await getAccounts(web3)
const contract = await getContractInstance(web3)
this.setState({ web3, accounts, contract })
```

This code first loads the Ethereum web3 provider and then uses it to load the
Ethereum accounts and the smart contract that this web app interacts with. We
are going to expand this code to create the Telepath channel as well. Change the
code to read:

```javascript
const telepath = new Telepath('https://telepath.cogito.mobi')
const channel = await telepath.createChannel({ appName: 'Tutorial' })
this.setState({ channel })

const web3 = await getWeb3()
const accounts = await getAccounts(web3)
const contract = await getContractInstance(web3)
this.setState({ web3, accounts, contract })
```

Notice how this code creates a new instance of Telepath, then creates a new
channel using the app name 'Tutorial', and finally adds the channel to the
state.

Finish up by declaring the `channel` property in the default state. Modify the
first line of the class as follows:

```javascript
state = { channel: null, web3: null, accounts: null, contract: null }
```

The code should now look like this:

![code for creating a telepath channel](./images/AddingTelepath.png)

### Display QR Code

Now that we created a Telepath channel, we are going to ensure that the Cogito
mobile app can connect to it. We are going to show a QR code that contains the
connection details. We'll need a module for displaying QR codes. You can
install it using:

    cd web-app
    yarn add qrcode.react

We can now open the `web-app/src/App.js` file and add the import for the module:

```javascript
import QRCode from 'qrcode.react'
```

Now we turn to the code that is displayed when loading web3:

```javascript
} else {
  return <p>Loading web3, accounts, and contract.</p>
}
```

We are going to change this code so that it displays the QRCode:

```javascript
} else if (web3Props.channel) {
  const { channel } = web3Props
  const connectUrl = channel.createConnectUrl('https://cogito.mobi')
  return (
    <div>
      <p>Loading web3, accounts, and contract.</p>
      <QRCode value={connectUrl} style={{ margin: '1em' }} />
      <p>Please scan the QR Code with the Cogito mobile app.</p>
    </div>
  )
} else {
  return <p>Creating Telepath Channel..</p>
}
```

The code now checks whether the Telepath channel has been created. When it's
been created we ask the channel to create a connection URL, which we then pass
on the QRCode component. We used `https://cogito.mobi` as the base url for the
connection URL. This ensures that scanning the QRCode on your mobile device will
take you to the Cogito mobile app when it's installed.

You may notice that when you reload the web-app it will show the QR Code only
for the briefest of moments, to be replaced by the home screen within a fraction
of a second. This happens because right after the Telepath channel has been
created, we load the regular Web3 that doesn't use the Telepath channel but
directly communicates with the Truffle development environment. We will change
that behaviour now.

### Use Cogito-web3

We now return to the `web-app/src/component/web3/Web3.js` file. Remember that we
updated the code in `componentDidMount` to look like this:

```javascript
const telepath = new Telepath('https://telepath.cogito.mobi')
const channel = await telepath.createChannel({ appName: 'Tutorial' })
this.setState({ channel })

const web3 = await getWeb3()
const accounts = await getAccounts(web3)
const contract = await getContractInstance(web3)
this.setState({ web3, accounts, contract })
```

We now want to use the Cogito web3 provider instead of the default one. We start
by installing the cogito-web3 package:

    cd web-app
    yarn add @cogitojs/cogito-web3

Then we add the following imports to the top of the file:

```javascript
import Web3 from 'web3'
import { CogitoProvider } from '@cogitojs/cogito-web3'
```

Finally, we change the code in `componentDidMount` like this:

```javascript
const telepath = new Telepath('https://telepath.cogito.mobi')
const channel = await telepath.createChannel({ appName: 'Tutorial' })
this.setState({ channel })

const originalWeb3 = await getWeb3()
const web3 = new Web3(
  new CogitoProvider({
    originalProvider: originalWeb3.currentProvider,
    telepathChannel: channel
  })
)

const accounts = await getAccounts(web3)
const contract = await getContractInstance(web3)
this.setState({ web3, accounts, contract })
```

This code creates a new Web3 instance using the CogitoProvider. The
CogitoProvider will forward most requests directly to the original Web3
provider. But some requests, such as those asking for available accounts or
requesting a transaction signature, will be forwarded to the Cogito mobile app,
where the accounts and their private keys are kept.

Before you go ahead and test the web app, we should take care of one last thing.
The accounts that are supplied by the Truffle development environment each had
some Ether pre-allocated so that they could pay for transaction fees. Your
Cogito account doesn't have any Ether, so you can't make any transactions yet.
To remedy this, we'll transfer some Ether to your Cogito account.

### Sending Ether to your account

First, we need your Ethereum account address. Open the web app, use the Cogito
mobile app to scan the QR code, and go the Accounts page. There you should see
your Ethereum address. Copy it. Then, go to the Truffle development console, and
enter the following command (substituting your own address):

    web3.eth.sendTransaction({to: '<your address>', from: '0x627306090abab3a6e1400e9345bc60c78a8bef57', value: web3.utils.toWei('5', 'ether')})

This should transfer 5 Ether from one of the test accounts to your account. You
can check your current balance by entering the following command in the Truffle
development console:

    web3.eth.getBalance('<your address>').then(balance => web3.utils.fromWei(balance, 'ether'))

Play around
-----------

We've now completed all the steps in this tutorial. So go ahead, take the web
app for a spin! You should be prompted in the Cogito mobile app whenever a new
transaction is about to be performed.

Further reading
---------------

We showed you how to integrate Cogito using Telepath and the Cogito Web3
provider. This illustrates how you can use Cogito with React, and hopefully
provides enough understanding to apply it in other web frameworks as well.

If you're looking for a nicer integration with React we recommend you take a
look at the [Cogito React](https://www.npmjs.com/package/@cogitojs/cogito-react)
and [Cogito React UI](https://www.npmjs.com/package/@cogitojs/cogito-react-ui)
packages.

[1]: https://nodejs.org
[2]: http://truffleframework.com
[3]: http://truffleframework.com/boxes/truffle-create-react-app
[4]: https://yarnpkg.com
