Faucet
======

This is a very simple faucet Express app. It supports the following REST call:

```
POST /donate/<ethereum address>
```

## Installation

Faucet is an npm package. You normally add it to the dev dependencies in your project:

```bash
$ yarn add -D @cogitojs/faucet
```

Faucet needs a configuration file to run. The name of the file depends on the value of the `NODE_ENV` variable and resolves to `faucet-config-<NODE_ENV>.json`. When `NODE_ENV` is not set it defaults to `faucet-config-development.json`. The configuration file needs to be in the same folder from where you start the faucet. If you put your configuration file in folder `config` then you must cd to that folder first before starting the faucet.

## Starting the faucet server

The easiest and recommended way of starting the faucet server is by adding a script to the `scripts` section of your `package.json`.

Assuming you have folder `faucet` and `faucet-config-production.json` inside it, you can use the following script:

```json
"scripts": {
  "start-faucet": "(cd faucet && cogito-faucet)"
}
```

Then, you start the faucet by doing:

```bash
$ NODE_ENV='production' yarn start-faucet
```

This will start the faucet with the configuration provided by your config file. You should see the output that looks like this:

```bash
yarn run v1.5.1
$ NODE_ENV='production' yarn start-faucet
$ (...)/node_modules/.bin/cogito-faucet
Using configuration:
{ providerUrl: 'http://130.144.76.85:8545',
  account: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
  privateKey: 'C87509A1C067BBDE78BEB793E6FA76530B6382A4C0241E5E4A9EC0A0F44DC0D3',
  donationTxGas: 21000,
  donationInEther: '1' }
Running on port 3001
```

## Configuration options

The following configuration options are available via the configuration file:

| key  | value type  | description |
|------|----------------|-------------|
| providerUrl | URL | Full URL of the node in your blockchain network (including `http` or `https` and port number if needed). This option can be overwritten by the environment variable `PROVIDER_URL` |
| privateKey | string | private key corresponding to the account (see below) |
| account | string | the account number (with `0x` prefix) |
| donationTxGas | number | gas: should be `21000` |
| donationInEther | string | how much ether to donate, e.g. `"1"` |

Below is the example configuration file:

```json
{
    "providerUrl": "https://your-ethereum-provider-url",
    "account": "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
    "privateKey": "C87509A1C067BBDE78BEB793E6FA76530B6382A4C0241E5E4A9EC0A0F44DC0D3",
    "donationTxGas": 21000,
    "donationInEther": "1"
}
```

and here is an example of the command that overwrites the `providerUrl` value from the configuration file by using environment variable:

```bash
$ NODE_ENV='production' PROVIDER_URL='http://192.168.1.112:8545' yarn start-faucet
```

## Using the faucet

After faucet is started, you can use test it by performing a post using e.g. `curl`:

```bash
curl -X POST -D - http://localhost:3001/donate/0xdf562290eceb83d659e23252ae8d38fa0bbc06e8
```

or using `http`:

```bash
http POST http://localhost:3001/donate/0xdf562290eceb83d659e23252ae8d38fa0bbc06e8
```
