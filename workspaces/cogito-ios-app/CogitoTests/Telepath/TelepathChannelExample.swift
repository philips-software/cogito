import Foundation
@testable import Cogito

extension TelepathChannel {
    static var example: TelepathChannel {

        let connectUrl = URL(string: "https://cogito.example.com/telepath/connect#I=1234&E=abcd&A=QQ")!
        return try! TelepathChannel(connectUrl: connectUrl)
    }
}
