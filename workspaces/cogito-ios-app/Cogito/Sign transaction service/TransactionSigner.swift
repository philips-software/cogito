import ReSwift
import BigInt

struct TransactionSignerBuilder {
    let transaction: [String: Any]
    let dispatch: DispatchFunction
    let getState: () -> AppState?
    let responseId: JsonRpcId
    let channel: TelepathChannel

    func build() -> TransactionSigner {
        guard let transaction = UnsignedTransaction(from: transaction) else {
            return TransactionSignerInvalid(dispatch: dispatch,
                                            responseId: responseId,
                                            channel: channel,
                                            error: SignTransactionError.invalidTransaction)
        }
        guard let identity = getState()?.diamond.findIdentity(address: transaction.from) else {
            return TransactionSignerInvalid(dispatch: dispatch,
                                            responseId: responseId,
                                            channel: channel,
                                            error: SignTransactionError.unknownIdentity)
        }
        return TransactionSignerValid(transaction: transaction,
                                      dispatch: dispatch,
                                      getState: getState,
                                      responseId: responseId,
                                      channel: channel,
                                      identity: identity)
    }
}

protocol TransactionSigner {
    var dispatch: DispatchFunction { get }
    func execute()
}

struct TransactionSignerInvalid: TransactionSigner {
    let dispatch: DispatchFunction
    let responseId: JsonRpcId
    let channel: TelepathChannel
    let error: SignTransactionError

    func execute() {
        dispatch(TelepathActions.Send(id: responseId,
                                      error: error,
                                      on: channel))
    }
}

struct TransactionSignerValid: TransactionSigner {
    let transaction: UnsignedTransaction
    let dispatch: DispatchFunction
    let getState: () -> AppState?
    let responseId: JsonRpcId
    let channel: TelepathChannel
    let identity: Identity

    func execute() {
        let storyBoard = UIStoryboard(name: "SignTransaction", bundle: nil)
        // swiftlint:disable force_cast
        let viewController = storyBoard.instantiateInitialViewController() as! UINavigationController
        let explanationViewController = viewController.topViewController! as! ExplanationViewController
        // swiftlint:enable force_cast
        let signingDone = { viewController.dismiss(animated: true) }

        guard let state = self.getState(), let appName = channel.appName else {
            self.dispatch(TelepathActions.Send(id: self.responseId,
                                               error: SignTransactionError.signingFailed,
                                               on: self.channel))
            signingDone()
            return
        }
        explanationViewController.appName = appName
        explanationViewController.actionDescription = "sign a blockchain transaction"
        explanationViewController.identity = identity

        explanationViewController.onReject = {
            self.dispatch(TelepathActions.Send(id: self.responseId,
                                               error: SignTransactionError.userRejected,
                                               on: self.channel))
            signingDone()
        }
        explanationViewController.onSign = {
            let keyStore = state.keyStore.keyStore!
            let identity = explanationViewController.identity!
            keyStore.sign(
                transaction: self.transaction,
                identity: identity
            ) { (signedTransaction, error) in
                guard let signedTx = signedTransaction else {
                    print("[error] sign transaction failed: \(error ?? "unknown error")")
                    self.dispatch(TelepathActions.Send(id: self.responseId,
                                                       error: SignTransactionError.signingFailed,
                                                       on: self.channel))
                    signingDone()
                    return
                }
                self.dispatch(TelepathActions.Send(id: self.responseId,
                                                   result: signedTx,
                                                   on: self.channel))
                signingDone()
            }
        }
        UIApplication.shared.keyWindow?.currentViewController?.present(viewController, animated: true)
    }
}
