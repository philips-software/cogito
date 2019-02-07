import Foundation
import ReSwift
import SwiftyJSON

struct GarbageBinService: TelepathService {
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
                    store.dispatch(GarbageBinActions.Add(key: key, value: value))
                    store.dispatch(TelepathActions.Send(id: request.id, result: "success", on: channel))
                } else {
                    store.dispatch(TelepathActions.Send(
                        id: request.id,
                        error: GarbageBinError.valueNotFound,
                        on: channel))
                }

            case "getValueForKey":
                if let value = store.state.garbage.valueForKey(key: key) {
                    store.dispatch(TelepathActions.Send(id: request.id, result: value, on: channel))
                } else {
                    store.dispatch(TelepathActions.Send(id: request.id, result: JSON.null, on: channel))
                }
            case "deleteKey":
                if store.state.garbage.bin[key] != nil {
                    store.dispatch(GarbageBinActions.Delete(key: key))
                    store.dispatch(TelepathActions.Send(id: request.id, result: "success", on: channel))
                } else {
                    store.dispatch(TelepathActions.Send(id: request.id,
                        error: GarbageBinError.noKeyInStore,
                        on: channel))
                }
            default:
                break
            }
        } else {
            store.dispatch(TelepathActions.Send(id: request.id, error: GarbageBinError.keyNotFound, on: channel))
        }

    }
}
