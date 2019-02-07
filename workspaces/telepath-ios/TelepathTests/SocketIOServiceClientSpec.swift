//  Copyright © 2019 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import SocketIO
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
            beforeEach {
                client.start(onNotification: {_ in })
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
                let base64EncodedData = data.base64EncodedString()
                client.notify(data: data)
                expect(socket.lastEmittedEventName).to(equal("notification"))
                expect(socket.lastEmittedEventItems?[0] as? String).to(equal(base64EncodedData))
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
}
