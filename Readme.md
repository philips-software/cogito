Telepath Queuing Service
========================
[![build status](https://gitlab.ta.philips.com/blockchain-lab/telepath-queuing-service/badges/master/build.svg)](https://gitlab.ta.philips.com/blockchain-lab/telepath-queuing-service/commits/master)
[![coverage report](https://gitlab.ta.philips.com/blockchain-lab/telepath-queuing-service/badges/master/coverage.svg)](https://gitlab.ta.philips.com/blockchain-lab/telepath-queuing-service/commits/master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Simple Queueing Service for use with Telepath. Allows two Telepath clients to
communicate when they are behind distinct NAT.

For an overview of what Telepath is, please visit the [main telepath repo][1].

### Known limitations

This service currently keeps all messages in memory. It has no limitations on
the amount of queues or messages that it accepts. It also doesn't clear out
stale messages. This means that its memory usage will continue to increase until
it runs out of memory. For now, only use this for testing, not for production.

### Usage

```sh
cd telepath-queuing-service
yarn start
```

### Cloud deployment

A [Terraform][2] script to deploy to Amazon Web Services is included. Adapt the
script to match your own Amazon environment, domain name and ssl certificate. 
Deploy to Amazon by issuing the following commands:

    terraform init
    terraform plan
    terraform apply

[1]: https://gitlab.ta.philips.com/blockchain-lab/telepath
[2]: https://terraform.io