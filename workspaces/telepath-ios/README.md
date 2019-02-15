# telepath-ios

> For a general introduction to telepath, please check [telepath-js](https://cogito.mobi/components/telepath-js).

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

You connect to a secure channel with the channel id, the corresponding
symmetric key (e.g. extracted from the QR Code scanned with the mobile app),
and the application name (which may be displayed to the user). Optionally you
can provide callbacks to handle incoming notifications and errors.

```swift
let channel = telepath.connect(channel: channelId, key: channelKey, appName: appName,
                               notificationHandler: notificationHandler,
                               completion: completionHandler)
)
```

You can also use a convenience method providing it with the Telepath URL (e.g. through a QR Code):

```swift
let channel = telepath.connect(url: telepathURL,
                               notificationHandler: notificationHandler,
                               completion: completionHandler)
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

### Notifications

Telepath also supports "fire and forget"-style *notifications*. In contrast,
with `receive` you can only receive a **reponse** to a matching `send` call.

A notification is sent using:

```swift
channel.notify(message: "a message")
```

If you want to be able to receive notifications, you have to provide a
notification handler when creating the channel. For example:

```swift
struct SampleNotificationHandler: NotificationHandler {
    func on(notification: String) {
        print("received notification: ", notification)
    }

    func on(error: Error) {
        print("notification error: ", error)
    }
}

let channel = telepath.connect(
    channel: channelId, key: channelKey, appName: appName,
    notificationHandler: notificationHandler) { error in
    if let error = error {
        print("connect failed; not retrying")
    } else {
        print("connection successful")
    }
}
```

> A note about the completion handler and error handler. Depending on what is
> actually going while trying to connect, one of two things can happen:
>
> * Telepath keeps trying to connect; in this case the `on(error:)` method
>   of your notification handler is called.
> * Telepath stops trying to connect and fails; the completion handler is
>   called with an error object as its parameter.

[queuing]: https://cogito.mobi/components/telepath-queuing-service
