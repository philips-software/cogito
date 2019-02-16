import Foundation
import ReSwift
import SwiftyJSON

struct ValueStoreService: TelepathService {
    let store: Store<AppState>

    init(store: Store<AppState>) {
        self.store = store
    }

    func onRequest(_ request: JsonRpcRequest, on channel: TelepathChannel) {
        guard request.method == "addKeyValuePair" ||
            request.method == "getValueForKey" ||
            request.method == "deleteKey" else { return }
        if let key = request.params["key"].string {
            switch request.method {
            case "addKeyValuePair":
                if let value = request.params["value"].string {
                    store.dispatch(ValueStoreActions.Add(key: key, value: value))
                    store.dispatch(TelepathActions.Send(id: request.id, result: "success", on: channel))
                } else {
                    store.dispatch(TelepathActions.Send(
                        id: request.id,
                        error: ValueStoreError.valueNotFound,
                        on: channel))
                }

            case "getValueForKey":
                if let value = store.state.valueStore.valueForKey(key: key) {
                    store.dispatch(TelepathActions.Send(id: request.id, result: value, on: channel))
                } else {
                    store.dispatch(TelepathActions.Send(id: request.id, result: JSON.null, on: channel))
                }
            case "deleteKey":
                if store.state.valueStore.store[key] != nil {
                    store.dispatch(ValueStoreActions.Delete(key: key))
                    store.dispatch(TelepathActions.Send(id: request.id, result: "success", on: channel))
                } else {
                    store.dispatch(TelepathActions.Send(id: request.id,
                        error: ValueStoreError.noKeyInStore,
                        on: channel))
                }
            default:
                break
            }
        } else {
            store.dispatch(TelepathActions.Send(id: request.id, error: ValueStoreError.keyNotFound, on: channel))
        }

    }
}
