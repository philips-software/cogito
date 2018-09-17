---
path: /components/faucet
title: Faucet
tag: component
---

This is a very simple faucet Express app. It supports the following REST call:

```
POST /donate/<ethereum address>
```

## Installation

Cogito Faucet is a NodeJS program. It can be installed by running

`npm install -g @cogitojs/faucet`

or alternatively

`yarn global install @cogitojs/faucet`

## Parameters

The `cogito-faucet` command takes the following arguments:

   * `<account>`, this first argument is the account number from which Ether
     will be donated. Needs to include the `0x` prefix.
   * `-d` or `--donation` followed by an amount of Ether. This is the amount of
     Ether that is donated per request. Defaults to `0.1`.
   * `-p` or `--provider` followed by the provider URL. This specifies the full
     URL of the node in your blockchain network (including `http` or `https` and
     port number if needed). Defaults to `http://localhost:8545`.

The private key that corresponds with the account is specified as an environment
variable:

```bash
COGITO_FAUCET_PRIVATE_KEY=C87509A1C067BBDE78BEB793E6FA76530B6382A4C0241E5E4A9EC0A0F44DC0D3
```

## Example

This runs a faucet that hands out Ether in amount of 0.01 from the account
0x627306090abab3a6e1400e9345bc60c78a8bef57, using its corresponding private key.
It uses the Ethereum node at ip address `192.168.1.112`:

```bash
COGITO_FAUCET_PRIVATE_KEY=C87509A1C067BBDE78BEB793E6FA76530B6382A4C0241E5E4A9EC0A0F44DC0D3 \
cogito-faucet --donation 0.01 --provider http://192.168.1.112:8545 0x627306090abab3a6e1400e9345bc60c78a8bef57
```

## Using the faucet

After the faucet is started, you can use test it by performing a post using e.g.
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