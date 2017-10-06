Telepath for iOS
================
[![build status](https://gitlab.ta.philips.com/blockchain-lab/telepath-ios/badges/master/build.svg)](https://gitlab.ta.philips.com/blockchain-lab/telepath/commits/master)
[![coverage report](https://gitlab.ta.philips.com/blockchain-lab/telepath-ios/badges/master/coverage.svg)](https://gitlab.ta.philips.com/blockchain-lab/telepath/commits/master)

Provides a secure channel for communication between a web app running in a browser and an app running on a mobile device.

For an overview of what Telepath is, please visit the [main telepath repo][2].

### Usage

```swift
import Telepath
```

Instantiating a Telepath instance given a Queuing Service:

```swift
let telepath = Telepath(queuing: queuingService)
```

Connecting to a secure channel when you have the channel id, and its key:

```swift
let channel = telepath.connect(channel: channelId, key: channelKey)
```

Connecting to a secure channel when you received a Telepath URL (e.g. through a QR Code):

```swift
let channel = telepath.connect(url: telepathURL)
```

[1]: https://en.wikipedia.org/wiki/Network_address_translation
[2]: https://gitlab.ta.philips.com/blockchain-lab/telepath
