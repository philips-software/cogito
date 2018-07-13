import ReSwift

struct DialogPresenterActions {
    struct DidDismissAlert: Action {}

    struct RequestAlert: Action {
        let requestedAlert: RequestedAlert
    }
}
