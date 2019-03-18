import Foundation
@testable import Cogito

class TelepathChannelSpy: TelepathChannel {
    var receiveMessage: String?
    var receiveError: Error?
    var sentMessage: String?
    var sendError: Error?

    convenience init(id: String = "1234") {
        let url = URL(string: "http://example.com/telepath/connect#I=\(id)&E=abcd&A=QQ")!
        self.init(connectUrl: url)
        self.connect(disableNotifications: true, completion: nil)
    }

    override func receive(completion: @escaping (String?, Error?) -> Void) {
        completion(receiveMessage, receiveError)
    }

    override func send(message: String, completion: @escaping (Error?) -> Void) {
        sentMessage = message
        completion(sendError)
    }
}
