//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation

struct URLActions {
    static func HandleIncomingURL(url: URL) -> Thunk { // swiftlint:disable:this identifier_name
        return Thunk { dispatch, getState in
            guard let identity = getState()?.diamond.selectedFacet() else {
                return
            }

            dispatch(TelepathActions.Connect(url: url, for: identity))
        }
    }
}
