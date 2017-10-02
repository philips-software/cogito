//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import ReSwift
import ReSwiftThunk

let appStore = Store<AppState>(
    reducer: appReducer,
    state: nil,
    middleware: [ThunkMiddleware(), ActionLogger()]
)
