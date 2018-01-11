//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct TransactionSignerBuilder {
    let transaction: [String:Any]
    let dispatch: DispatchFunction
    let getState: () -> AppState?

    func build() -> TransactionSigner {
        return TransactionSignerInvalid(error: "field 'from' is missing in transaction data", dispatch: dispatch)
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
