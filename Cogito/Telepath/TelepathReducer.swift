//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func telepathReducer(_ action: Action, _ state: TelepathState?) -> TelepathState {
    var nextState = state ?? initialTelepathState
    switch action {
    case let connected as TelepathActions.ConnectFulfilled:
        nextState.channel = connected.channel
    case let failure as TelepathActions.ConnectRejected:
        nextState.connectionError = failure.error.localizedDescription
    case let received as TelepathActions.ReceiveFulfilled:
        nextState.receivedMessages.append(received.message)
    default:
        break
    }
    return nextState
}
