//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import SwiftyJSON

struct TransactionSigningService: TelepathService {
    let store: Store<AppState>

    func onRequest(_ request: JsonRpcRequest) {
        guard request.method == "sign",
              let txDict = request.params[0].dictionaryObject else {
            return
        }
        store.dispatch(TransactionSigningActions.Sign(tx: txDict,
                                                      responseId: request.id))
    }
}
