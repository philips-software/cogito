Faucet
======

This is a very simple faucet Express app. It supports the following REST call:

```
POST /donate/<ethereum address>
```

Calling this will transfer a bit of Ether to the given address. For example:

```bash
curl -X POST -D - https://secure-transfer-chain.charterlab.tech/node-1/faucet/donate/0xdf562290eceb83d659e23252ae8d38fa0bbc06e8
```
