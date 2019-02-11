//  Copyright © 2019 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import SocketIO
import base64url
@testable import Telepath

class SocketIOServiceClientSpec: QuickSpec {
    override func spec() {
        var manager: SocketManager!
        var socket: SocketStub!
        var client: SocketIOServiceClient!

        beforeEach {
            manager = SocketManager(socketURL: URL(string: "http://example.com/")!, config: [.log(false)])
            socket = SocketStub(manager: manager, nsp: "/")
            client = SocketIOServiceClient(socket: socket)
        }

        it("can be constructed") {
            expect(client.socket) == socket
        }

        it("ignores notify because it is not started") {
            client.notify(data: Data(bytes: [1, 2, 3, 4]))
            expect(socket.lastEmittedEventName).to(beNil())
            expect(socket.lastEmittedEventItems).to(beNil())
        }

        context("when started") {
            let notificationSpy = NotificationsSpy()

            beforeEach {
                client.start(onNotification: notificationSpy.onNotification)
            }

            it("can be started") {
                expect(socket.connected).to(beTrue())
                expect(socket.handlers).to(haveCount(1))
            }

            it("cleans up when deinited") {
                client = nil
                expect(socket.connected).to(beFalse())
                expect(socket.handlers).to(haveCount(0))
            }

            it("can send notifications") {
                let data = Data(bytes: [1, 2, 3, 4])
                let base64EncodedData = data.base64urlEncodedString()
                client.notify(data: data)
                expect(socket.lastEmittedEventName).to(equal("notification"))
                expect(socket.lastEmittedEventItems?[0] as? String).to(equal(base64EncodedData))
            }

            it("base64url decodes incoming notifications") {
                let message = "a message".data(using: .utf8)!
                let encodedMessage = message.base64urlEncodedString().data(using: .utf8)!

                socket.fakeIncomingNotification(data: encodedMessage)
                expect(notificationSpy.lastReceivedNotification) == message
            }
        }
    }
}

class SocketStub: SocketIOClient {
    var connected = false
    var lastEmittedEventName: String?
    var lastEmittedEventItems: [Any]?

    override func connect() {
        connected = true
        didConnect(toNamespace: "/")
    }

    override func disconnect() {
        connected = false
    }

    override func emit(_ event: String, _ items: SocketData..., completion: (() -> Void)?) {
        lastEmittedEventName = event
        lastEmittedEventItems = items
    }

    func fakeIncomingNotification(data: Data) {
        handlers.first?.executeCallback(with: [data], withAck: 0, withSocket: self)
    }
}

private class NotificationsSpy {
    var lastReceivedNotification: Data?

    func onNotification(message: Data) {
        lastReceivedNotification = message
    }
}
