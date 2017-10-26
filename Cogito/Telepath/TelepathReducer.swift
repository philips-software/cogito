//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func telepathReducer(_ action: Action, _ state: TelepathState?) -> TelepathState {
    var nextState = state ?? initialTelepathState
    switch action {
    case let connect as TelepathActions.Connect:
        nextState.connectUrl = connect.url
    default:
        break
    }
    return nextState
}
