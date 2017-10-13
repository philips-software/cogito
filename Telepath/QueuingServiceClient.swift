//Copyright © 2017 Philips. All rights reserved.

public struct QueuingServiceClient: QueuingService {
    let url: String

    public init(url: String) {
        self.url = url
    }

    public func send(queueId: QueueID, message: Data) throws {

    }

    public func receive(queueId: QueueID) throws -> Data? {
        return nil
    }
}
