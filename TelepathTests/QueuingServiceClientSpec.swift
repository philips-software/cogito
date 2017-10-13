//Copyright © 2017 Philips. All rights reserved.

import Quick
import Nimble
@testable import Telepath

class QueuingServiceClientSpec: QuickSpec {
    override func spec() {
        let baseUrl = "https://queueing.exampe.com"

        var queuing: QueuingServiceClient!

        beforeEach {
            queuing = QueuingServiceClient(url: baseUrl)
        }

        it("implements QueuingService protocol") {
            expect(queuing as QueuingService).toNot(beNil())
        }
    }
}
