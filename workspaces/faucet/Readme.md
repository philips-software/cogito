Faucet
======

This is a very simple faucet Express app. It supports the following REST call:

```
POST /donate/<ethereum address>
```

## Configure

### Development settings
Setup your configuration in `faucet-config-development.json`.
You can start with the given example.
```
cp faucet-config-example.json faucet-config-development.json
```

### Production settings
Setup your configuration in `faucet-config-production.json`.
You can start with the given example.
```
cp faucet-config-example.json faucet-config-production.json
```

## Run

Calling this will transfer a bit of Ether to the given address. For example:

```bash
curl -X POST -D - http://localhost:3001/donate/0xdf562290eceb83d659e23252ae8d38fa0bbc06e8
```
