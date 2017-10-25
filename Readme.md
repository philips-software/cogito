Cogito Web3
===========
[![pipeline status](https://gitlab.ta.philips.com/blockchain-lab/cogito-web3/badges/master/pipeline.svg)](https://gitlab.ta.philips.com/blockchain-lab/cogito-web3/commits/master)
[![coverage report](https://gitlab.ta.philips.com/blockchain-lab/cogito-web3/badges/master/coverage.svg)](https://gitlab.ta.philips.com/blockchain-lab/cogito-web3/commits/master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

An Ethereum [Web3][1] provider that uses the Cogito app to manage accounts and
signing. Requires a [Telepath channel][2] to be set up for communication with the
Cogito app.

Usage
-----

```javascript
const Web3 = require('web3')
const CogitoProvider = require('cogito-web3')

const provider = new CogitoProvider({
  originalProvider: new Web3.providers.HttpProvider("http://localhost:8545")
  telepathChannel: /* a previously set up telepath channel */
})
const web3 = new Web3(provider)
```

[1]: https://github.com/ethereum/web3.js
[2]: https://gitlab.ta.philips.com/blockchain-lab/telepath
