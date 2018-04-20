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
- `yarn lerna run --scope @cogito/** build` to build all workspaces (or use `"@cogito/**"`, with
  quotes, as required by your shell)
- in the folder `workspaces/demo-app/truffle`, run `yarn install`

### Running the demo app
Run local blockchain using Truffle:
- inside folder `workspaces/demo-app/truffle`, run `yarn truffle dev` to enter Truffle development mode; keep this running
- inside that Truffle development console, run `migrate` to deploy the smart contracts
- using a separate terminal, inside the folder `workspaces/demo-app` start the demo app using `yarn start`


[1]: http://blockchain-lab.gitlab-pages.ta.philips.com/cogito