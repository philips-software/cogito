import ReSwift
import ReSwiftThunk

let appStore = Store<AppState>(
    reducer: appReducer,
    state: nil,
    middleware: [createThunksMiddleware(), ActionLogger()]
)
