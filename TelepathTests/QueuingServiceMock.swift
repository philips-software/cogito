//Copyright © 2017 Philips. All rights reserved.

@testable import Telepath

class QueuingServiceMock: QueuingService {
    var latestQueueId: QueueID?
    var latestSentMessage: Data?

    var messageToReturn: Data?
    var sendError: Error?
    var receiveError: Error?

    func send(queueId: QueueID, message: Data) throws {
        if let error = sendError {
            throw error
        }
        latestQueueId = queueId
        latestSentMessage = message
    }

    func receive(queueId: QueueID) throws -> Data? {
        if let error = receiveError {
            throw error
        }
        latestQueueId = queueId
        return messageToReturn
    }
}
