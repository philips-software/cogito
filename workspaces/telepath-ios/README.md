# telepath-ios

> For a general introduction to telepath, please check [telepath-js](/components/telepath-js).

## Usage

First import `Telepath` in your source file:

```swift
import Telepath
```

and then instantiate a Telepath instance.
You need the URL of a running [Queuing Service][queuing].

> We recommend that you create your own queuing service for the actual deployment.
For the testing purposes you can use a queuing service available at [https://telepath.cogito.mobi](https://telepath.cogito.mobi).

```swift
let telepath = Telepath(queuingServiceUrl: URL(string: "https://...."))
```

### Connecting to the secure channel

You connect to a secure channel with the channel id, and the corresponding
symmetric key (e.g. extracted from the QR Code scanned with the mobile app):

```swift
let channel = telepath.connect(channel: channelId, key: channelKey)
```

You can also use a convenience method providing it with the Telepath URL (e.g. through a QR Code):

```swift
let channel = telepath.connect(url: telepathURL)
```

### Sending and receiving messages over secure channel

You send messages over a secure channel using the `send` method:

```swift
channel.send(message: "a message") { error: Error? in
    // ...
}
```

and you receive messages using the `receive` method:

```swift
channel.receive { message: String?, error: Error? in
    // ...
}
```

The received `message` will be `nil` when no message is available.

[queuing]: /components/telepath-queuing-service
