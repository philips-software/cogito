Cogito
======
[![build status](https://gitlab.ta.philips.com/blockchain-lab/Cogito/badges/master/build.svg)](https://gitlab.ta.philips.com/blockchain-lab/Cogito/commits/master)
[![coverage report](https://gitlab.ta.philips.com/blockchain-lab/Cogito/badges/master/coverage.svg)](https://gitlab.ta.philips.com/blockchain-lab/Cogito/commits/master)

Cogito is an identity management app.

[Documentation][1]

Open Issues
-----------
* The library used for handling the JWTs from the OpenID Connect provider does not check the JWT signature.
* Instead of passing a realm URL for OpenID Connect attestations, webfinger should be used.
* The web app currently sends a string that identifies it by name; this should be replaced with some sort of registry.

[1]: http://blockchain-lab.gitlab-pages.ta.philips.com/cogito