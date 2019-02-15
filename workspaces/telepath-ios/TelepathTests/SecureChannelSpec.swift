import Quick
import Nimble
@testable import Telepath

class SecureChannelSpec: QuickSpec {
    override func spec() {
        let channelId: QueueID = "channel_id"
        let channelKey = ChannelKey.example()
        let appName = "example"

        var channel: SecureChannel!
        var queuing: QueuingServiceMock!
        var socketIOService: SocketIOServiceMock!
        var notificationsSpy: NotificationsSpy!

        beforeEach {
            queuing = QueuingServiceMock()
            socketIOService = SocketIOServiceMock()
            notificationsSpy = NotificationsSpy()
            channel = SecureChannel(
                queuing: queuing, socketIOService: socketIOService,
                onNotification: notificationsSpy.onNotification,
                onNotificationError: nil,
                id: channelId, key: channelKey, appName: appName,
                completion: nil)
        }

        context("when sending a message") {
            let message = "a message"

            beforeEach {
                waitUntil { done in
                    channel.send(message: message) { _ in done() }
                }
            }

            it("encrypts the message") {
                let cypherText = queuing.latestSentMessage!
                let plainText = try! channelKey.decrypt(cypherText: cypherText)
                expect(String(data: plainText, encoding: .utf8)) == message
            }

            it("it uses the blue queue") {
                expect(queuing.latestQueueId) == channelId + ".blue"
            }
        }

        context("when receiving a message") {
            let message = "a message"

            var receivedMessage: String?

            beforeEach {
                let plainText = message.data(using: .utf8)!
                let cypherText = channelKey.encrypt(plainText: plainText)
                queuing.messageToReturn = cypherText
                waitUntil { done in
                    channel.receive { message, _ in
                        receivedMessage = message
                        done()
                    }
                }
            }

            it("decrypts the message") {
                expect(receivedMessage) == message
            }

            it("uses the red queue") {
                expect(queuing.latestQueueId) == channelId + ".red"
            }
        }

        it("indicates when no message is available") {
            queuing.messageToReturn = nil
            waitUntil { done in
                channel.receive { message, _ in
                    expect(message).to(beNil())
                    done()
                }
            }
        }

        it("throws when there's an error while sending") {
            struct SomeError: Error {}
            queuing.sendError = SomeError()
            waitUntil { done in
                channel.send(message: "some message") { error in
                    expect(error).toNot(beNil())
                    done()
                }
            }
        }

        it("indicates when there's an error while receiving") {
            struct SomeError: Error {}
            queuing.receiveError = SomeError()
            waitUntil { done in
                channel.receive { _, error in
                    expect(error).toNot(beNil())
                    done()
                }
            }
        }

        it("indicates when there's an error while decrypting") {
            queuing.messageToReturn = "invalid data".data(using: .utf8)
            waitUntil { done in
                channel.receive { _, error in
                    expect(error).toNot(beNil())
                    done()
                }
            }
        }

        describe("notifications") {
            let message = "plain text message"

            it("encrypts the payload") {
                channel.notify(message: message)
                let cypherText = socketIOService.latestSentMessage!
                let plainText = try! channelKey.decrypt(cypherText: cypherText)
                expect(String(data: plainText, encoding: .utf8)) == message
            }

            it("decrypts and forwards incoming notifications") {
                let plainText = message.data(using: .utf8)!
                let cypherText = channelKey.encrypt(plainText: plainText)
                socketIOService.fakeIncomingNotification(data: cypherText)
                expect(notificationsSpy.lastReceivedNotification) == message
            }
        }
    }
}

private class NotificationsSpy {
    var lastReceivedNotification: String?

    func onNotification(message: String) {
        lastReceivedNotification = message
    }
}
