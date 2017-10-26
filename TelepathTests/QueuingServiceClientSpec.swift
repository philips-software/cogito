//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
import Mockingjay
@testable import Telepath

class QueuingServiceClientSpec: QuickSpec {
    override func spec() {
        let baseUrl = URL(string: "https://queueing.exampe.com")!
        let queueId = "a_queue_id"
        let message = "a message".data(using: .utf8)!

        var queuing: QueuingServiceClient!

        beforeEach {
            queuing = QueuingServiceClient(url: baseUrl)
        }

        it("implements QueuingService protocol") {
            expect(queuing as QueuingService).toNot(beNil())
        }

        it("can send a message") {
            waitUntil { done in
                self.stub(http(.post, uri: "\(baseUrl)/\(queueId)")) { request in
                    expect(Data(reading: request.httpBodyStream!)) == message
                    return http(200)(request)
                }
                queuing.send(queueId: queueId, message: message) { error in
                    expect(error).to(beNil())
                    done()
                }
            }
        }

        describe("send errors") {
            it("returns error when connection fails") {
                let someError = NSError(domain: "", code: 0, userInfo: nil)
                waitUntil { done in
                    self.stub(http(.post, uri: "\(baseUrl)/\(queueId)"), failure(someError))
                    queuing.send(queueId: queueId, message: message) { error in
                        expect(error).toNot(beNil())
                        done()
                    }
                }
            }

            it("returns error when http post was unsuccessfull") {
                waitUntil { done in
                    self.stub(http(.post, uri: "\(baseUrl)/\(queueId)"), http(500))
                    queuing.send(queueId: queueId, message: message) { error in
                        expect(error).toNot(beNil())
                        done()
                    }
                }
            }
        }

        it("can receive a message") {
            waitUntil { done in
                self.stub(
                    http(.get, uri: "\(baseUrl)/\(queueId)"),
                    http(200, headers: nil, download: .content(message))
                )
                queuing.receive(queueId: queueId) { receivedMessage, error in
                    expect(error).to(beNil())
                    expect(receivedMessage) == message
                    done()
                }
            }
        }

        describe("receive errors") {
            it("returns error when connection fails") {
                let someError = NSError(domain: "", code: 0, userInfo: nil)
                waitUntil { done in
                    self.stub(http(.get, uri: "\(baseUrl)/\(queueId)"), failure(someError))
                    queuing.receive(queueId: queueId) { _, error in
                        expect(error).toNot(beNil())
                        done()
                    }
                }
            }

            it("returns error when http get was unsuccessfull") {
                waitUntil { done in
                    self.stub(http(.get, uri: "\(baseUrl)/\(queueId)"), http(500))
                    queuing.receive(queueId: queueId) { _, error in
                        expect(error).toNot(beNil())
                        done()
                    }
                }
            }
        }
    }
}

extension Data {
    init(reading input: InputStream) {
        self.init()
        input.open()
        var buffer = [UInt8](repeating: 0, count: 4096)
        while input.hasBytesAvailable {
            let amount = input.read(&buffer, maxLength: buffer.count)
            self.append(buffer, count: amount)
        }
        input.close()
    }
}
