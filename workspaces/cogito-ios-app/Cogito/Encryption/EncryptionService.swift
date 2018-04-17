//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import ReSwift

struct EncryptionService: TelepathService {
    let store: Store<AppState>
    func onRequest(_ request: JsonRpcRequest, on channel: TelepathChannel) {
        if let identity = store.state.telepath.channels[channel] {
            store.dispatch(DiamondActions.CreateEncryptionKeyPair(identity: identity))
        }
    }
}
