//Copyright © 2017 Philips. All rights reserved.

public struct QueuingServiceClient: QueuingService {
    let url: String

    public init(url: String) {
        self.url = url
    }

    public func send(queueId: QueueID, message: Data) throws {
        let queueUrl = URL(string: "\(url)/\(queueId)")
        var request = URLRequest(url: queueUrl!)
        request.httpMethod = "POST"
        let task = URLSession.shared.uploadTask(with: request, from: message)
        task.resume()
    }

    public func receive(queueId: QueueID) throws -> Data? {
        return nil
    }
}
