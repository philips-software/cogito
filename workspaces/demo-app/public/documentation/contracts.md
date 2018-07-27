## Executing Ethereum contracts

Executing contracts may require signing. This is where Cogito makes it super easy for the user.

### The demo

In our demo we have one contract deployed called `SimpleStorage`.
`SimpleStorage` stores a numerical value and provides methods to read and to increase it.
              
Executing an Ethereum contract method involves sending a transaction. If your contract method does not modify the contract internal state (a read-only operation), the contract method will be executed immediately without requiring the sender to sign the transaction. A read-only transaction will also not incur any costs on the sender.
When increasing the value stored in the contract, however, the sender needs to sign the transaction and also pay for its execution.

Because your identity lives on the Cogito iOS app, you will use the
Cogito iOS app to sign the contract. In the demo, we check if the
secure connection between the web app and the iOS app is already established. If not you will be presented with a QR-code that you need to scan with the Cogito iOS app. You can also always request a new QR-code (you have to do that every time when you want to use another identity).
