//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
@testable import Cogito

class DispatchRecorder<ActionType> {
    var actions = [ActionType]()
    var count: Int { return actions.count }
    var dispatch: DispatchFunction!

    init() {
        dispatch = { action in
            if let action = action as? ActionType {
                self.actions.append(action)
            }
        }
    }
}
