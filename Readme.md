Telepath Queuing Service
========================

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

[1]: https://gitlab.ta.philips.com/blockchain-lab/telepath
