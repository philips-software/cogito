Telepath for iOS
================
[![build status](https://gitlab.ta.philips.com/blockchain-lab/telepath-ios/badges/master/build.svg)](https://gitlab.ta.philips.com/blockchain-lab/telepath/commits/master)
[![coverage report](https://gitlab.ta.philips.com/blockchain-lab/telepath-ios/badges/master/coverage.svg)](https://gitlab.ta.philips.com/blockchain-lab/telepath/commits/master)

Provides a secure channel for communication between a web app running in a
browser and an app running on a mobile device.

[Documentation][1]

[1]: http://blockchain-lab.gitlab-pages.ta.philips.com/telepath

### Known Limitations

Currently uses independent encryption of messages. A recipient can therefore not detect if some messages have been duplicated, deleted or reordered.