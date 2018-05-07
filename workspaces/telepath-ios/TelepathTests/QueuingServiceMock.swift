//Copyright © 2017 Philips. All rights reserved.

@testable import Telepath

class QueuingServiceMock: QueuingService {
    var latestQueueId: QueueID?
    var latestSentMessage: Data?

    var messageToReturn: Data?
    var sendError: Error?
    var receiveError: Error?

    func send(queueId: QueueID, message: Data, completion: @escaping (Error?) -> Void) {
        latestQueueId = queueId
        latestSentMessage = message
        if let error = sendError {
            completion(error)
        } else {
            completion(nil)
        }
    }

    func receive(queueId: QueueID, completion: @escaping (Data?, Error?) -> Void) {
        latestQueueId = queueId
        if let error = receiveError {
            completion(nil, error)
        } else {
            completion(messageToReturn, nil)
        }
    }

    public func invalidate() {
        // do nothing for now
    }
}
