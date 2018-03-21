Telepath for Javascript
=======================

[![build status](https://gitlab.ta.philips.com/blockchain-lab/cogito/badges/master/build.svg)](https://gitlab.ta.philips.com/blockchain-lab/cogito/commits/master)
[![coverage report](https://gitlab.ta.philips.com/blockchain-lab/cogito/badges/master/coverage.svg)](https://gitlab.ta.philips.com/blockchain-lab/cogito/commits/master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Provides a secure channel for communication between a web app running in a
browser and an app running on a mobile device.

[Documentation][1]

[1]: http://blockchain-lab.gitlab-pages.ta.philips.com/cogito#telepath-js

### Known Limitations

Currently uses independent encryption of messages. A recipient can therefore not detect if some messages have been duplicated, deleted or reordered.