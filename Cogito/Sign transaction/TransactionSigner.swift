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
            return TransactionSignerInvalid(dispatch: dispatch,
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
    let dispatch: DispatchFunction
    let responseId: JsonRpcId

    func execute() {
        dispatch(TelepathActions.Send(id: responseId, error: SignTransactionError.invalidTransaction))
    }
}

struct TransactionSignerValid: TransactionSigner {
    let transaction: UnsignedTransaction
    let dispatch: DispatchFunction
    let getState: () -> AppState?
    let responseId: JsonRpcId

    func execute() {
        let storyBoard = UIStoryboard(name: "SignTransaction", bundle: nil)
        // swiftlint:disable force_cast
        let viewController = storyBoard.instantiateInitialViewController() as! UINavigationController
        let explanationViewController = viewController.topViewController! as! ExplanationViewController
        // swiftlint:enable force_cast
        let state = self.getState()!
        // Values below should not be hard-coded; see https://gitlab.ta.philips.com/blockchain-lab/Cogito/issues/1
        explanationViewController.appName = "HealthSuite Insights Marketplace"
        explanationViewController.actionDescription = "sign a blockchain transaction"
        explanationViewController.identity = state.diamond.findIdentity(address: transaction.from)

        let signingDone = { viewController.dismiss(animated: true) }

        explanationViewController.onReject = {
            self.dispatch(TelepathActions.Send(id: self.responseId,
                                               error: SignTransactionError.userRejected))
            signingDone()
        }
        explanationViewController.onSign = {
            let keyStore = state.keyStore.keyStore!
            let identity = state.diamond.selectedFacet()!
            keyStore.sign(
                transaction: self.transaction,
                identity: identity
            ) { (signedTransaction, error) in
                guard let signedTx = signedTransaction else {
                    print("[error] sign transaction failed: \(error ?? "unknown error")")
                    self.dispatch(TelepathActions.Send(id: self.responseId,
                                                       error: SignTransactionError.signingFailed))
                    signingDone()
                    return
                }
                self.dispatch(TelepathActions.Send(id: self.responseId, result: signedTx))
                signingDone()
            }
        }
        UIApplication.shared.keyWindow?.currentViewController?.present(viewController, animated: true)
    }
}
