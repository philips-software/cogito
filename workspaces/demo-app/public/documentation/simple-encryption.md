## Cogito Simple Encryption

Cogito can encrypt and decrypt data for you. The public-private key pair used for encryption and decryption lives in the user's Cogito iOS app. Since the public key can be known by anyone, it can be retrieved from the Cogito app. Using that public key, encryption is done purely in the browser. Decryption on the other hand requires that the private key is used, so the Cogito mobile app is involved.

### How does it work?

What actually happens is this: on *encryption*, a symmetrical key is generated in the browser. This key is used for encrypting the data that is provided. The symmetrical key itself is also encrypted, using the public key from the user's identity. On *decryption*, the encrypted symmetrical key is sent to the Cogito mobile app, which decrypts it and returns the key itself. That key is then used to decrypt the actual data in the browser. This scheme ensures that the actual data that is encrypted never leaves the browser. Also, the amount of data that is exchanged with the Cogito mobile app is very small (just the symmetrical key).

