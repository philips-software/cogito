//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift

struct DialogPresenterState: Codable {
    let requestedAlerts: [RequestedAlert]

    init(requestedAlerts: [RequestedAlert]) {
        self.requestedAlerts = requestedAlerts
    }

    init(from decoder: Decoder) throws {
        requestedAlerts = []
    }

    func encode(to encoder: Encoder) throws {}

}

let initialDialogPresenterState = DialogPresenterState(requestedAlerts: [])
