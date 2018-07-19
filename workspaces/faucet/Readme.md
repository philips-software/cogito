Faucet
======

This is a very simple faucet Express app. It supports the following REST call:

```
POST /donate/<ethereum address>
```

## Installation

Faucet is an npm package. You normally add it to the dev dependencies in your
project:

```bash
$ yarn add -D @cogitojs/faucet
```

Faucet needs a configuration file to run. The name of the file depends on the
value of the `NODE_ENV` variable and resolves to
`faucet-config-<NODE_ENV>.json`. When `NODE_ENV` is not set it defaults to
`faucet-config-development.json`. The configuration file needs to be in the same
folder from where you start the faucet. If you put your configuration file in
folder `config` then you must cd to that folder first before starting the
faucet.

## Starting the faucet server

The easiest and recommended way of starting the faucet server is by adding a
script to the `scripts` section of your `package.json`.

Assuming you have folder `faucet` and `faucet-config-production.json` inside it,
you can use the following script:

```json
"scripts": {
  "start-faucet": "(cd faucet && cogito-faucet)"
}
```

Then, you start the faucet by doing:

```bash
$ NODE_ENV='production' yarn start-faucet 0x627306090abaB3A6e1400e9345bC60c78a8BEf57
```

This will start the faucet with the configuration provided by your config file.
You should see the output that looks like this:

```bash
yarn run v1.5.1
$ NODE_ENV='production' yarn start-faucet
$ (...)/node_modules/.bin/cogito-faucet
Running on port 3001
```

## Parameters

The start-faucet command takes the following arguments:

   * `<account>`, this first argument is the account number from which Ether
     will be donated. Needs to include the `0x` prefix.
   * `-p` or `--provider` followed by the provider URL. This specifies the full
     URL of the node in your blockchain network (including `http` or `https` and
     port number if needed). Defaults to `http://localhost:8545`.

## Configuration options

The following configuration options are available via the configuration file:

| key  | value type  | description |
|------|----------------|-------------|
| privateKey | string | private key corresponding to the account (see below) |
| donationInEther | string | how much ether to donate, e.g. `"1"` |

Below is the example configuration file:

```json
{
    "privateKey": "C87509A1C067BBDE78BEB793E6FA76530B6382A4C0241E5E4A9EC0A0F44DC0D3",
    "donationInEther": "1"
}
```

## Using the faucet

After faucet is started, you can use test it by performing a post using e.g.
`curl`:

```bash
curl -X POST -D - http://localhost:3001/donate/0xdf562290eceb83d659e23252ae8d38fa0bbc06e8
```

or using [httpie](https://httpie.org):

```bash
http POST http://localhost:3001/donate/0xdf562290eceb83d659e23252ae8d38fa0bbc06e8
```

When using a deployed network, you may want to increase the timeouts. For
`curl`:

```bash
curl -X POST -m 600 -D - https://blockchain.deployed.com/faucet/donate/0x6b0be084e6ffc7d6cace8e01e2814c869257c3aa
```

for `httpie`:

```bash
http --timeout=600 POST https://blockchain.deployed.com/faucet/donate/0x6b0be084e6ffc7d6cace8e01e2814c869257c3aa
```

This will give the network `10min`.