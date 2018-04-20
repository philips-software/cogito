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

Then you can go to the folder `workspaces/demo-app` and start it using `yarn start`.


[1]: http://blockchain-lab.gitlab-pages.ta.philips.com/cogito