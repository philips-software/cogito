//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import BigInt

struct TransactionSignerBuilder {
    let transaction: [String:Any]
    let dispatch: DispatchFunction
    let getState: () -> AppState?
    let responseId: JsonRpcId

    func build() -> TransactionSigner {
        guard let tx = UnsignedTransaction(from: transaction) else {
            return TransactionSignerInvalid(error: "missing or invalid field(s) in transaction data",
                                            dispatch: dispatch,
                                            responseId: responseId)
        }
        return TransactionSignerValid(transaction: tx,
                                      dispatch: dispatch,
                                      getState: getState,
                                      responseId: responseId)
    }
}

protocol TransactionSigner {
    var dispatch: DispatchFunction { get }
    func execute()
}

struct TransactionSignerInvalid: TransactionSigner {
    let error: String
    let dispatch: DispatchFunction
    let responseId: JsonRpcId

    func execute() {
        dispatch(TelepathActions.Send(id: responseId, errorCode: -1/*todo*/, errorMessage: error))
    }
}

struct TransactionSignerValid: TransactionSigner {
    let transaction: Transaction
    let dispatch: DispatchFunction
    let getState: () -> AppState?
    let responseId: JsonRpcId

    func execute() {
        let state = getState()!
        let keyStore = state.keyStore.keyStore!
        let identity = state.diamond.selectedFacet()!
        keyStore.sign(transaction: transaction,
                      chainId: BigInt(5), /* todo hard-coded */
                      identity: identity) { (signedTransaction, error) in
            guard let signedTx = signedTransaction else {
                self.dispatch(TelepathActions.Send(id: self.responseId,
                                              errorCode: -2/*todo*/,
                                              errorMessage: error ?? "unknown error"))
                return
            }
            let txDict = signedTx.asDictionary()
            self.dispatch(TelepathActions.Send(id: self.responseId, result: txDict))
        }
    }
}
