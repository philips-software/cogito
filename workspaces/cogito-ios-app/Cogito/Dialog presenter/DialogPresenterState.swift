import ReSwift

struct DialogPresenterState: Codable {
    var requestedAlerts: [RequestedAlert]

    init(requestedAlerts: [RequestedAlert]) {
        self.requestedAlerts = requestedAlerts
    }

    init(from decoder: Decoder) throws {
        requestedAlerts = []
    }

    func encode(to encoder: Encoder) throws {}

}

let initialDialogPresenterState = DialogPresenterState(requestedAlerts: [])
