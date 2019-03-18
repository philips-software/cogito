import Foundation
@testable import Cogito

extension TelepathChannel {
    static var example: TelepathChannel {

        let connectUrl = URL(string: "https://cogito.example.com/telepath/connect#I=1234&E=abcd&A=QQ")!
        let channel = TelepathChannel(connectUrl: connectUrl)
        channel.connect(disableNotifications: true, completion: nil)
        return channel
    }
}
