//  Copyright © 2018 Koninklijke Philips Nederland B.V. All rights reserved.

import Foundation
import Telepath
import SwiftyJSON

let telepathServerUrl = URL(string: "https://telepath.cogito.mobi")!

class TelepathHandler {
    static let shared = TelepathHandler()
    let telepath = Telepath(serviceUrl: telepathServerUrl)
    var channel: SecureChannel?

    func handle(url: URL) -> Bool {
        let function = url.pathComponents[2]
        switch function {
        case "connect":
            return connect(url: url)
        default:
            return false
        }
    }

    func connect(url: URL) -> Bool {
        let aChannel = try? telepath.connect(url: url) { notification in
            print("received notification: ", notification)
        }
        guard let channel = aChannel else {
            print("Invalid URL: ", url)
            return false
        }
        self.channel = channel
        notify()
        return true
    }

    func receive() {
        guard let channel = channel else { return }
        
        channel.receive { (message, error) in
            guard let message = message else {
                print("No message received; error: ", error ?? "-")
                return
            }
            print("Message received; message: \(message); error: ", error ?? "-")
            let id = JSON(parseJSON: message)["id"]
            let response = [
                "jsonrpc": "2.0",
                "result": "Hi! iOS here!",
                "id": id
            ]
            channel.send(message: JSON(response).rawString()!) { error in
                print("Message sent; error: ", error ?? "-")
            }
        }
    }

    func notify() {
        guard let channel = channel else { return }
        let response = [
            "jsonrpc": "2.0",
            "method": "didScanQRCode"
        ]
        channel.notify(message: JSON(response).rawString()!)
    }
}
