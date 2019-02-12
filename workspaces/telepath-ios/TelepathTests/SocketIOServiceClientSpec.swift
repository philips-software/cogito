//  Copyright © 2019 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import SocketIO
import base64url
@testable import Telepath

class SocketIOServiceClientSpec: QuickSpec {
    override func spec() {
        var manager: SocketManager!
        var socket: SocketMock!
        var client: SocketIOServiceClient!

        beforeEach {
            manager = SocketManager(socketURL: URL(string: "http://example.com/")!, config: [.log(false)])
            socket = SocketMock(manager: manager, nsp: "/")
            client = SocketIOServiceClient(socket: socket)
        }

        it("ignores notify because it is not started") {
            client.notify(data: Data(bytes: [1, 2, 3, 4]))
            expect(socket.lastEmittedEventName).to(beNil())
            expect(socket.lastEmittedEventItems).to(beNil())
        }

        context("when started") {
            let channelID = "testChannel"
            var notificationSpy: NotificationsSpy!

            beforeEach {
                notificationSpy = NotificationsSpy()
                client.start(channelID: channelID, onNotification: notificationSpy.onNotification)
            }

            context("when connection is not yet complete") {
                let data = Data(bytes: [1, 2, 3, 4])

                beforeEach {
                    socket.resetMock()
                    client.notify(data: data)
                }

                it("records notification as pending and doesn't send yet") {
                    expect(socket.lastEmittedEventName).to(beNil())
                    expect(client.pendingNotifications).to(haveCount(1))
                }

                it("sends pending notifications after connection is complete") {
                    expect(client.setupComplete).toEventually(beTrue())
                    expect(client.pendingNotifications).to(haveCount(0))
                    expect(socket.lastEmittedEventName).to(equal("notification"))
                    let base64EncodedData = data.base64urlEncodedString()
                    expect(socket.lastEmittedEventItems?[0] as? String).to(equal(base64EncodedData))
                }
            }

            context("after connection is complete") {
                beforeEach {
                    expect(client.setupComplete).toEventually(beTrue())
                }

                it("is configured properly") {
                    expect(socket.connected).to(beTrue())
                    expect(socket.handlers).to(haveCount(2))
                }

                it("cleans up when deinited") {
                    client = nil
                    expect(socket.connected).to(beFalse())
                    expect(socket.handlers).to(haveCount(0))
                }

                it("after connecting, it identifies itself") {
                    expect(socket.lastEmittedEventName).toEventually(equal("identify"))
                    expect(socket.lastEmittedEventItems?[0] as? String).to(equal(channelID))
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
}

private class NotificationsSpy {
    var lastReceivedNotification: Data?

    func onNotification(message: Data) {
        lastReceivedNotification = message
    }
}
