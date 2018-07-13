import ReSwift
import SwiftyJSON

struct TransactionSigningService: TelepathService {
    let store: Store<AppState>

    func onRequest(_ request: JsonRpcRequest, on channel: TelepathChannel) {
        guard request.method == "sign",
              let txDict = request.params[0].dictionaryObject else {
            return
        }
        store.dispatch(TransactionSigningActions.Sign(tx: txDict,
                                                      responseId: request.id,
                                                      channel: channel))
    }
}
