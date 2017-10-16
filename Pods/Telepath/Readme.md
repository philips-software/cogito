Telepath for iOS
================
[![build status](https://gitlab.ta.philips.com/blockchain-lab/telepath-ios/badges/master/build.svg)](https://gitlab.ta.philips.com/blockchain-lab/telepath/commits/master)
[![coverage report](https://gitlab.ta.philips.com/blockchain-lab/telepath-ios/badges/master/coverage.svg)](https://gitlab.ta.philips.com/blockchain-lab/telepath/commits/master)

Provides a secure channel for communication between a web app running in a browser and an app running on a mobile device.

For an overview of what Telepath is, please visit the [main telepath repo][2].

### Known Limitations

Currently uses independent encryption of messages. A recipient can therefore not detect if some messages have been duplicated, deleted or reordered.

### Usage

```swift
import Telepath
```

Instantiating a Telepath instance. You need the URL of a running [Queuing Service][3].

```swift
let telepath = Telepath(queuingServiceUrl: "https://....")
```

Connecting to a secure channel when you have the channel id, and its key:

```swift
let channel = telepath.connect(channel: channelId, key: channelKey)
```

Connecting to a secure channel when you received a Telepath URL (e.g. through a QR Code):

```swift
let channel = telepath.connect(url: telepathURL)
```

Sending messages:

```swift
channel.send(message: "a message") { error: Error? in
    // ...
}
```

Receiving messages. Received message is `nil` when no message is waiting.

```swift
channel.receive { message: String?, error: Error? in
    // ...
}
```

[1]: https://en.wikipedia.org/wiki/Network_address_translation
[2]: https://gitlab.ta.philips.com/blockchain-lab/telepath
[3]: https://gitlab.ta.philips.com/blockchain-lab/telepath-queuing-service
