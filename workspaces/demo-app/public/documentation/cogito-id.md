## Your Cogito Identity

All your Cogito Identities are kept on your mobile via Cogito iOS App. 

> They are feeling good there and do not have any intention to leave.

But what is your Cogito Identity? Cogito Identity is your Ethereum address.
This address is actually a *public key* derived from the *private key* that was
created for you created a new identity with your Cogito iOS app. In short thus:
your Cogito Identity is a *key pair*.

It would be very hard to manage your identities using only Ethereum addresses.
They are not really easy to remember. For this reason, when you create an identity
on the Cogito iOS app, you also provide a short description that you will use to
refer to your identity.

It is ok to share your Cogito address, but you have to secure the associated
private key. This is why your private key stays on the iOS App and never leaves it.

Reading your Cogito Identity means retrieving the Ethereum address and
the associated short description. But how can you get it from your mobile device
in the first place? You use *Telepath*.

### Telepath

You can think about telepath as a secure channel between your web app
(the one that runs on the browser) and the Cogito iOS app (that runs on your mobile).

In order to make this connection really secure, the Web App and the Cogito iOS app need
know some secret - a symmetric key - that they will use to encrypt and decrypt messages
they exchange. This secret is created on the browser and in order to transfer it to
the iOS app, you have to scan a QR code, which you will see when you click on
the `Read your identity...` button on the left. You can request a new QR code at any time
by clicking `Show QR code`.

You can use `@cogitojs/telepath-js` in order to interact with Telepath from your web app,
and `@cogitojs/telepath-ios` to interact with Telepath from your iOS app. It is, however,
far more convenient to use higher level abstractions: `CogitoEthereum` from `@cogitojs/cogito-ethereum` package and
`CogitoReact` from `@cogitojs/cogito-react` that uses `CogitoEthereum` underneath.
Being a React app, our demo-app does exactly this. It uses `CogitoReact` to maintain the telepath channel. In order to present you with a QR code it uses another handy helper from the Cogito
family `CogitoConnector` from `@cogitojs/cogito-react-ui` package.

### Cogito Identity

Being provided with a telepath channel from `CogitoReact`, you easily read your Cogito Identity using `@cogitojs/cogito-identity` package:

```javascript
const cogitoIdentity = new CogitoIdentity({ channel })
const requestedProperties = [
  CogitoIdentity.Property.EthereumAddress,
  CogitoIdentity.Property.Username
]
const info = await cogitoIdentity.getInfo({ properties: requestedProperties })
// info.ethereumAddress: e.g. 0x98b1B58DC2Be94037b685D1EB5bdC6cf3a7078b3
// info.username:        e.g. Steward
```

In the example above we first create an instance of `CogitoIdentity` providing
a telepath channel as an argument. Then perform an asynchronous call to `getInfo` method
of `CogitoIdentity` providing the requested properties as the argument. In the response
we receive the identity info object consisting of your Ethereum address (`info.ethereumAddress`)
and the corresponding description (`info.username`).

### Learn more

- [@cogitojs/telepath-js](https://github.com/philips-software/cogito/blob/master/workspaces/telepath-js/Readme.md)
- [@cogitojs/telepath-ios](https://github.com/philips-software/cogito/blob/master/workspaces/telepath-ios/Readme.md)
- [@cogitojs/cogito-ethereum](https://github.com/philips-software/cogito/tree/master/workspaces/cogito-ethereum)
- [@cogitojs/cogito-react](https://github.com/philips-software/cogito/tree/master/workspaces/cogito-react)
- [@cogitojs/cogito-react-ui](https://github.com/philips-software/cogito/tree/master/workspaces/cogito-react-ui)
- [@cogitojs/cogito-identity](https://github.com/philips-software/cogito/blob/master/workspaces/cogito-identity/Readme.md)
