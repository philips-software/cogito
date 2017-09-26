Telepath
========

Provides a secure channel for communication between a web app running in a browser and an app running on a mobile device.

Setting up a secure channel between the mobile device and a browser is done using a QR code that is presented by the web app whenever a secure channel is required. The user can then open the secure channel by scanning the QR code using the app on the phone.

### Architecture

Telepath consists of a javascript library that can be used in web apps, and an iOS library for mobile apps.

Because both the browser and phone are likely to be behind distinct [NAT][1], we provide a server with a public ip address to facilitate peer-to-peer communication between them. This is a fairly simple server that only holds end-to-end encrypted messages in queues. 

Setting up a secure channel is done using these steps:

1.  The web app requests a secure connection to the identity app by invoking the `createChannel` function on the javascript library.
2.  The `createChannel` function generates a random channel id (`I`) and a pair of random symmetric keys for encryption (`E`) and message authentication (`A`).
3.  The web app displays a QR code containing the channel id `I`, and keys `E` and `A`.
4.  The owner of the phone opens the app, points the camera to the QR code.
5.  The phone app extracts the channel id and the two keys from the QR code.
6.  Both phone and web app can now communicate on channel `I`. They encrypt their messages using the key `E` and ensure message integrity with key `A`.

[1]: https://en.wikipedia.org/wiki/Network_address_translation

