//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct TransactionSignerBuilder {
    let transaction: [String:Any]
    let dispatch: DispatchFunction
    let getState: () -> AppState?

    func build() -> TransactionSigner {
        guard let tx = Transaction(from: transaction) else {
            return TransactionSignerInvalid(error: "missing or invalid field(s) in transaction data",
                                            dispatch: dispatch)
        }
        return TransactionSignerValid(transaction: tx, dispatch: dispatch)
    }
}

protocol TransactionSigner {
    var dispatch: DispatchFunction { get }
    func execute()
}

extension TransactionSigner {
    func send(error: String) {
        let msg = TransactionSignerResult(error: error).json
        dispatch(TelepathActions.Send(message: msg))
    }
}

struct TransactionSignerResult: Codable {
    let serializedRawTransaction: String?
    let error: String?

    init(serializedRawTransaction: String? = nil, error: String? = nil) {
        self.serializedRawTransaction = serializedRawTransaction
        self.error = error
    }
}

struct TransactionSignerInvalid: TransactionSigner {
    let error: String
    let dispatch: DispatchFunction

    func execute() {
        send(error: error)
    }
}

struct TransactionSignerValid: TransactionSigner {
    let transaction: Transaction
    let dispatch: DispatchFunction

    func execute() {
    }
}
