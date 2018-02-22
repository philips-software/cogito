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
    let transaction: UnsignedTransaction
    let dispatch: DispatchFunction
    let getState: () -> AppState?
    let responseId: JsonRpcId

    func execute() {
        let onReject = { (_:Any) in
            self.dispatch(TelepathActions.Send(id: self.responseId,
                                               errorCode: -3/*todo*/,
                                               errorMessage: "user rejected"))
        }
        let onSign = { (_:Any) in
            let state = self.getState()!
            let keyStore = state.keyStore.keyStore!
            let identity = state.diamond.selectedFacet()!
            keyStore.sign(
                transaction: self.transaction,
                identity: identity
            ) { (signedTransaction, error) in
                guard let signedTx = signedTransaction else {
                    self.dispatch(TelepathActions.Send(id: self.responseId,
                                                       errorCode: -2/*todo*/,
                        errorMessage: error ?? "unknown error"))
                    return
                }
                self.dispatch(TelepathActions.Send(id: self.responseId, result: signedTx))
            }
        }

        let alert = UIAlertController(title: "Signature requested",
                                      message: "DSP Marktetplace requests your signature for a blockchain transaction.",
                                      preferredStyle: .actionSheet)
        let rejectAction = UIAlertAction(title: "Reject", style: .cancel, handler: onReject)
        let signAction = UIAlertAction(title: "Sign", style: .default, handler: onSign)
        alert.addAction(rejectAction)
        alert.addAction(signAction)
        UIApplication.shared.keyWindow?.currentViewController?.present(alert, animated: true)
    }
}
