---
title: Tutorial
path: /tutorial
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

![unbox output](images/TruffleUnbox.png)

Running the web app
-------------------

You can now start an Ethereum test environment by opening the Truffle
development console:

    truffle develop

Which should give you a prompt like this:

![develop prompt](images/TruffleDevelop.png)

Our project includes an example smart contract in `contracts/SimpleStorage.sol`.
Deploy this smart contract now by executing the following command in the
Truffle development console:

    migrate

![migrate output](images/TruffleMigrate.png)

Now that we have our Ethereum test environment with smart contracts setup, we
can start a local server to test our web app. In a separate terminal issue the
following commands:

    cd web-app
    yarn start

![react server output](images/ReactServer.png)

You should now be able to browse to http://localhost:3000, and see the webapp in
action.

![web app](images/WebApp.png)

When you play around with the web app you'll notice that you can interact with
the smart contract without having to sign any transactions. This happens because
we are currently using a dummy account that is provided by the Truffle
development environment. In the next section we will add proper transaction
signing using the Cogito app.

Cogito integration
------------------

To enable signing with the Cogito app, we'll go through these steps:

1. Set up Telepath to enable communication between the web app and the Cogito
   mobile app.
2. Replace the standard Ethereum Web3 provider with a Cogito specific version.

### Setup Telepath

The web app and the Cogito mobile app communicate with each other through an
encrypted channel called Telepath. We start by adding the Telepath package to
our project:

    cd web-app
    yarn add @cogitojs/telepath-js

TODO

### Use Cogito-web3

TODO

[1]: https://nodejs.org
[2]: http://truffleframework.com
[3]: http://truffleframework.com/boxes/truffle-create-react-app
[4]: https://yarnpkg.com
