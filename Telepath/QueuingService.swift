//Copyright © 2017 Philips. All rights reserved.

public protocol QueuingService {
    func send(queueId: QueueID, message: Data, completion: @escaping (Error?) -> Void)
    func receive(queueId: QueueID, completion: @escaping (Data?, Error?) -> Void)
}

public typealias QueueID = String
