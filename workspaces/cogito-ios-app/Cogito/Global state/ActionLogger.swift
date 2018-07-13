import ReSwift

public func ActionLogger<S>() -> Middleware<S> { // swiftlint:disable:this identifier_name (swiftlint bug?)
    return { dispatch, getState in
        return { next in
            return { action in
                print("[debug] Action: ", action)
                return next(action)
            }
        }
    }
}
