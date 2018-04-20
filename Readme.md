Cogito Identity
===============

[![pipeline status](https://gitlab.ta.philips.com/blockchain-lab/cogito/badges/master/pipeline.svg)](https://gitlab.ta.philips.com/blockchain-lab/cogito/commits/master)
[![coverage report](https://gitlab.ta.philips.com/blockchain-lab/cogito/badges/master/coverage.svg)](https://gitlab.ta.philips.com/blockchain-lab/cogito/commits/master)

Cogito is a mobile app that you can use to identify yourself to websites. It
supports interaction with Ethereum blockchains and OpenID.

[Documentation][1]

Development
-----------
After cloning, run:
- `yarn install` to install all dependencies
- `yarn lerna run --scope @cogitojs/** build` to build all workspaces (or use `"@cogitojs/**"`, with
  quotes, as required by your shell)
- in the folder `workspaces/demo-app/truffle`, run `yarn install`

Refer to [demo-app](workspaces/demo-app/Readme.md) for details on running the demo app.


[1]: http://blockchain-lab.gitlab-pages.ta.philips.com/cogito