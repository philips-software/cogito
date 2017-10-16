//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
import Mockingjay
@testable import Telepath

class QueuingServiceClientSpec: QuickSpec {
    override func spec() {
        let baseUrl = "https://queueing.exampe.com"
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
                    done()
                    return http(200)(request)
                }
                try! queuing.send(queueId: queueId, message: message)
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
