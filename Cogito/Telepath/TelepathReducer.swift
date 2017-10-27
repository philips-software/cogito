//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func telepathReducer(_ action: Action, _ state: TelepathState?) -> TelepathState {
    var nextState = state ?? initialTelepathState
    switch action {
    case let connected as TelepathActions.Connected:
        nextState.channel = connected.channel
    default:
        break
    }
    return nextState
}
