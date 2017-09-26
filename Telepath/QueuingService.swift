//Copyright © 2017 Philips. All rights reserved.

public protocol QueuingService {
    func send(queueId: QueueID, message: Data) throws
    func receive(queueId: QueueID) throws -> Data?
}

public typealias QueueID = String
