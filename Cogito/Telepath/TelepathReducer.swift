//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

func telepathReducer(_ action: Action, _ state: TelepathState?) -> TelepathState {
    var nextState = state ?? initialTelepathState
    switch action {
    case let connected as TelepathActions.ConnectFulfilled:
        nextState.channel = connected.channel
    case let connectFailure as TelepathActions.ConnectRejected:
        nextState.connectionError = connectFailure.error.localizedDescription
    case let received as TelepathActions.ReceiveFulfilled:
        nextState.receivedMessages.append(received.message)
    case let receiveFailure as TelepathActions.ReceiveRejected:
        nextState.receiveError = receiveFailure.error.localizedDescription
    default:
        break
    }
    return nextState
}
