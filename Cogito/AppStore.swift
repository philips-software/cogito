//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk

let appStore = Store<AppState>(
    reducer: appReducer,
    state: nil,
    middleware: [ThunkMiddleware()]
)
