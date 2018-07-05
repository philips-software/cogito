# Cogito iOS App

The architecture of the Cogito iOS App follows the [FLux](http://facebook.github.io/flux/) architecture (although in a simpler way). It is a combination [ReSwift](https://github.com/ReSwift/ReSwift) and [RxSwift](https://github.com/ReactiveX/RxSwift), using [ReRxSwift](https://github.com/svdo/ReRxSwift) to make the combination easier to use.

## Key Management

Key Management is decoupled from any specific Ethereum Blockchain network.

It is based on the [Mobile: Account management](https://github.com/ethereum/go-ethereum/wiki/Mobile:-Account-management) from Ethereum. An interesting read may also be [Mobile: Introduction](https://github.com/ethereum/go-ethereum/wiki/Mobile:-Introduction)


## Signing transactions

[JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction)

In particular [eth_sendtransaction](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction)