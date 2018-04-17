# Data Science Platform (DSP) Demo
[![build status](https://gitlab.ta.philips.com/blockchain-lab/dsp-demo/badges/master/build.svg)](https://gitlab.ta.philips.com/blockchain-lab/dsp-demo/commits/master)

## Demo Setup

The demo uses the following components, each of which is described in more detail below.

- Web application: shows that a user requests an algorithm from the market place, the request is approved, and the algorithm is bought and paid for so that the user can start using it.
- Cogito: the app that manages a user's identity and allows the user to sign blockchain transactions.
- Telepath Queueing Service: a message queue that the web application and Cogito use to communicate with each other.
- Keycloak IAM: one of the things demonstrated is that Cogito can sign using an identity that is provably backed by an OpenID Connect identity. For the demo, a Keycloak installation is used to show this.

## Web Application

The project is a standard React web-app client based on create-react-app and truffle setup in the `truffle` subfolder.

The create-react-app based React project uses a symlink to the `../truffle/build/contracts` folder containing ABI definitions (created after running `truffle compile`). This link can be restored with `yarn link-contracts` command.

### Installation

From top level folder do:

  ```bash
  yarn && (cd truffle && yarn)
  ```

### Creating a local network that allows you to sign transactions

First, forget about `truffle develop` followed by `compile` and `migrate`. There are nice...for children ;). We need a local network with at least one account that has enough funds. It is easy to create that account using [ganache-cli](https://github.com/trufflesuite/ganache-cli). Install it with `yarn global add ganache-cli`. Once you have it, start the network with the following command:

```bash
ganache-cli --account="0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3,10000000000000000000000" -p 8545
```

This will give you a running network, with sufficient ether (should be something around 10000). Now we need to transfer a bit of this ether to the accounts that we create with our Cogito iOS App. To do this, we use `geth` to attach to our network with this command:

```bash
geth attach http://localhost:8545
```

If you don't have it installed, install it with `brew install geth`.

Once there, you can check that your are indeed attached to your account, check the balance, etc:

```bash
> eth.accounts
["0x627306090abab3a6e1400e9345bc60c78a8bef57"]

> web3.fromWei(eth.getBalance(eth.coinbase),'ether')
10000
```

To transfer to your Cogito iOS App account (or any other account for that matter), run:

```bash
> eth.sendTransaction({to: "0x89c708a533a2d83af484e7d3f9c126c7529e39ec", from: "0x627306090abab3a6e1400e9345bc60c78a8bef57", value: web3.toWei('50', 'ether')})
"0x471c1f58f6db8b20465211164dc8414634ba3f2a97e8d9adf3c06d7a334c0cbc"
```

Check the balance after transaction, should be something like:

```bash
> web3.fromWei(eth.getBalance(eth.coinbase),'ether')
9949.999999999999979
```

You can even check the balance on the destination account:

```bash
> web3.fromWei(eth.getBalance("0x89c708a533a2d83af484e7d3f9c126c7529e39ec"),'ether')
50
```

Now lets deploy our contracts to the network. We will use `truffle console` instead of `truffle develop`. We already have network, we just want to deploy to it:

```bash
» cd truffle
» yarn truffle console
truffle(development)> migrate
Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x64e787312560e805ff4ce54b8859ce1c5d7f1d6c42e91a2988d51a8a6661b209
  Migrations: 0xf12b5dd4ead5f743c6baa640b0216200e89b60da
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying SimpleStorage...
  ... 0x12d977bd2a66476eec91c66c825a768748d659d584a867dceddefb111368c706
  SimpleStorage: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
Saving artifacts...
truffle(development)>
```

Now, you can start the web-app, and you should be able to sign transactions with Cogito iOS App.

### Using Metamask to make network setup easier

You can use [Metamask](https://metamask.io) to simplify transfers. It turns out that Metamask works well with both the development TestRPC network as well as with our deployed AWS network.

You can install Metamask as plugin/extension in your browser. I was testing it on Google Chrom and it worked well with both standard and beta ui.

> In beta mode, when working with TestRPC, the `gas fee` field keep loading and never finishes. I managed to get around this, but temporarily selecting any other non-localhost ethereum network and switching back to localhost:8545. Then the transaction can be finished. This problem is not visible in standard ui mode.

#### Using Metamask with TestRPC

There are two great articles from Truffle:

1. [USING METAMASK WITH TRUFFLE DEVELOP](http://truffleframework.com/docs/advanced/truffle-with-metamask).
2. [TRUFFLE AND METAMASK](http://truffleframework.com/tutorials/truffle-and-metamask#truffle-and-metamask) - this now considered obsolete but may still be useful.

Here are my steps.

First, I started my ganache TestRPC network as before:

```
$ cd truffle
$ yarn ganache-cli --account="0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3,10000000000000000000000" -p 8545
```

Now, following the documentation above, we use the seed phrase to bootstrap the account:

```
candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
```

This will automatically add `0x627306090abab3a6e1400e9345bc60c78a8bef57` as first account with 10000,- Ether on it.

Now, after you create identities for *Deirdre* and *Albert* on the Cogito iOS App, you can use the corresponding Ethereum address (which you will find in the account properties in the app) to transfer some ether (10 Ether will be enough for many demos) to these accounts.

This way, you do not need to use `geth`. You still will need to deploy (migrate) the contracts as described above.

![Metamask Localhost](dsp-demo-assets/MetamaskLocalhost.png)

![localhost8545](dsp-demo-assets/localhost8545.png)

#### Using Metamask with our AWS network

Here the steps are a bit different. Network is already there and the access point is `https://dsp-chain.charterlab.tech/node-1/`. You just need to add this network to Metamask:

![dsp-chain](dsp-demo-assets/dsp-chain.png)

Now, once you are connected to the network, create a new account. This will be the account from which you will be seeding accounts that you create on the Cogito iOS App (this will be our equivalent of the `0x627306090abab3a6e1400e9345bc60c78a8bef57` for the TestRPC above).

Now we need to get some cash to this account. We will use [Mist](https://github.com/ethereum/mist/releases) for that. In order to start Mist I use the following command:

```
$ /Applications/Mist.app/Contents/MacOS/Mist --rpc https://dsp-chain.charterlab.tech/node-1/ --swarmurl "null"
```

> I installed Mist as recommended by Mist people. I did not use brew/cask for that. Feel free to use any other way if that works better for you.

Once you have Mist running, transfer some ether (a bit more this time, so that we do not need to use Mist to frequently) to you newly created account on Metamask. The password for the AWS account (Mist will ask for it) is `test`.

After that, just follow the same steps as described above.

#### Deploying the contracts to AWS blockchain

> First a small request. Please always consult deployment with the BlockchainLab team before you start changing anything on the AWS network. You normally do not need to deploy contracts yourself. Even if you need to use the deployed contracts with your app (to create new production build or to use AWS network during development), you do not need to deploy contracts just for this reason. We will be hosting deployed contract on a separate repo (together with a script that will allow you to automatically change the absolute paths that truffle puts inside). You will copy them to your `truffle/build` folder and you can create production build or use it in the development.

Now, having said that, in order to deploy the contracts, we need to make sure that the account is unlocked. We can log in to the container running `geth` on the EC2 instance, then attach to `geth`, and finally run unlock web3 command. But instead, there is a simpler way. Just use your local `geth` client and run:

```
$ geth attach https://dsp-chain.charterlab.tech/node-1
Welcome to the Geth JavaScript console!

instance: Geth/v1.7.3-stable-4bb3c89d/linux-amd64/go1.9
coinbase: 0x28825f00d57a8566265a7182c906b59ad9233f7f
at block: 143852 (Sun, 04 Mar 2018 20:58:05 CET)
 modules: eth:1.0 net:1.0 personal:1.0 rpc:1.0 web3:1.0

> personal.unlockAccount("0x28825f00d57a8566265a7182c906b59ad9233f7f")
```

Mind the password: `test`.

Now, without too much of a hesitation (the account will lock itself after some time of inactivity), migrate the contracts using the following command:

```
$ cd truffle
$ rm -rf build # optional
$ yarn truffle migrate --reset --network dsp --compile-all
```

Now, you should be able to use the updated contracts with the deployed app at `https://dsp.charterlab.tech`.

### Running the frontend

Run the create-react-app server for the front-end. Smart contract changes must be manually recompiled and migrated.

```bash
# Serves the front-end on http://localhost:3000
yarn start
```

### Tests

Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.

```bash
# If inside the development console - use `truffe develop` not `truffle console`
migrate
test

# If outside the development console.
cd truffle
yarn test
```

To run the web-app tests:

```bash
# Change directory to the front-end folder
yarn test               # for watch mode
CI=TRUE yarn test       # for non-watch mode
```
### Deploying to netlify

We deploy the frontend to netlify. First make sure you have `netlify-cli` installed on your machine globally:

```bash
yarn global add netlify
```

Then run:

```bash
yarn build
netlify deploy
```
### Deploying contracts options

Right out of the box, the app supports working with develop ethereum network. You can change this by modifying the `REACT_APP_WEB3_PROVIDER_URL` variable in `web-app/.env` file. If the `REACT_APP_WEB3_PROVIDER_URL` is not defined, the default `http://localhost:8545` will be used. The value of `REACT_APP_WEB3_PROVIDER_URL` will also be used in production. If you want to use different url for local development and for production (and still in both cases be different from `http://localhost:8545`), then you can use `REACT_APP_WEB3_PROVIDER_URL_PRODUCTION`. In case both `REACT_APP_WEB3_PROVIDER_URL` and `REACT_APP_WEB3_PROVIDER_URL_PRODUCTION` are missing then `http://localhost:8545` will be used for both development and production.

> The URL for our AWS hosted blockchain is `https://dsp-chain.charterlab.tech/node-1/`.

### Some hints when running the demo

1. When you start with new setup or when you switch from one network to another, make sure that for the first transaction you scan the QR-code with the right account. So, for example, if you are *Deirdre* on the web app, make sure you are *Deirdre* on the iOS App, and when you are *Albert* on the web app, make sure you are *Albert* on the iOS App. After the first successful transaction for the given account, you do not have to align anymore - the iOS App will take care.
2. Make sure that you remove all old tabs with KeyCloak on Safari on iOS and then restart Safari.
3. When using deployed version of the app, be patient - this is real network it may take some time before transaction will be processed.
4. If you the system becomes unresponsive, first try to remove you iOS App and then install it again and setup the system from scratch again. If this does not work, please let us know.
5. The web app has a special (hidden) url: `https://dsp.charterlab.tech/kernel-panic` (also available on `localhost`). It will let you conveniently clear the state of the app or just reset the progress indicators so that the buttons get enabled again.
6. Finally, here are the user names and corresponding passwords for the demo personas:

    | User        | login name      | login password  |
    | ------------- |:-------------:| :------:|
    | Deirdre       | deirdre       | deirdre |
    | Albert        | albert        | albert  |
    | Peter         | peter         | peter   |
    | Anton         | anton         | anton   |

### Visual Studio Code integration

The project is ready for Visual Studio Code. Out of the box it supports integration with [standardJS](https://standardjs.com) and [vscode-jest](https://github.com/jest-community/vscode-jest).

#### standardJS

The integration with standardJS is done on two levels: `settings.json` for the VSCode Workspace and the top-level `package.json`.

The workspace level options in `settings.json` are the following:

```json
"javascript.validate.enable": false,
"standard.usePackageJson": true,
"standard.autoFixOnSave": true
```

The top-level `package.json` includes the following standardJS configuration:

```json
"standard": {
  "parser": "babel-eslint",
  "ignore": [
      "build/**",
      "node_modules/**",
      "web-app/node_modules/**",
      "web-app/src/contracts"
  ],
  "envs": [
      "es6",
      "browser",
      "jest"
  ],
  "globals": [
      "artifacts",
      "contract",
      "assert"
  ]
}
```

The only thing that still remains to be performed by the user is to install the `JavaScript Standard Style` extension (authored by Sam Chen).

#### vscode-jest

The vscode-jest extension (authored by orta and jest community) provides integration with jest test runner. Because the react project is in a subfolder, additional configuration has been added to the workspace `settings.json` file:

> Note, included just for reference. This is no longer valid. Our project is now in the top-level folder; truffle is in a subfolder.

```json
# "jest.pathToJest": "npm test --",
# "jest.rootPath": "web-app",
"jest.restartJestOnSnapshotUpdate": true
```

Note, that for the very same reason, Jest extension needs to be started manually via command palette (`CMD+SHIFT+P` and then *Jest: Start Runner*).

> jest extension for VSCode only runs the tests for the web-app. You still need to run solidity tests using the truffle development console.

## Cogito

Documentation about Cogito can be found in the [Cogito Git repository][1].

## Telepath Queueing Service

Documentation about Telepath can be found in the [Telepath Git repository][3].

## Keycloack IAM

The following repository contains the Terraform scripts to generate our
Keycloak installation on AWS: https://gitlab.ta.philips.com/blockchain-lab/keycloak-aws-infra.

After creating the setup, the Cogito client definition for Keycloak can be imported using the Keycloak web UI. The JSON file containing the config is in [`keycloak-client-config.json` in the Cogito repository][2].


[1]: https://gitlab.ta.philips.com/blockchain-lab/Cogito
[2]: https://gitlab.ta.philips.com/blockchain-lab/Cogito/blob/master/Documentation/keycloak-client-config.json
[3]: https://gitlab.ta.philips.com/blockchain-lab/telepath-queuing-service

## create-react-app front-end

This is the front-end client for our dapp. It is built with `create-react-app`.

### pages

This folder contains the pages having their own url. The name of each sub-directory corresponds to a separate route.

We use [react-router](https://reacttraining.com/react-router/web/) for routing.

### contracts

A symlink to `truffle/build/contracts` located in the Truffle project is placed here so that the React app can refer to the build artifacts from the parent Truffle project.

### .env

This file contains environment variables.

| ENV  | default value  | description |
|------|----------------|-------------|
| BROWSER | `google chrome` | the browser to be used by CRA |
| NODE_PATH | `src/`  | Default import path. It will let us to use import paths |
| REACT_APP_USE_INJECTED_WEB3 | `NO` | If set to `NO` the `web3` instance potentially injected in the browser (like _MetaMask_)will be ignored. Set it to `YES` to use `web3` object that was injected. |
| REACT_APP_WEB3_PROVIDER_URL | `http://localhost:9545` | The local provider URL. Relevant only when `REACT_APP_USE_INJECTED_WEB3` is set to `NO`. This is the default provider URL used by truffle development console. |

### conventions

We promote using named exports rather than default export. For a reasoning you may check out [Why we have banned default exports in Javascript and you should do the same](https://blog.neufund.org/why-we-have-banned-default-exports-and-you-should-do-the-same-d51fdc2cf2ad).

Then to make module imports more communicative, and to improve encapsulation, we use `index.js` file in every folder. This file might be considered a public API for your component.

You may also consider using a `package.json` file instead `index.js`. We found `index.js` to be slightly more flexible for that purpose.

Such a `package.json` would contain only one attribute pointing out to the main file in your component, e.g.:

```json
{
  "main": "Accounts.js"
}
```
