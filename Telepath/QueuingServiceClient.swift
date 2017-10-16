//Copyright © 2017 Philips. All rights reserved.

public struct QueuingServiceClient: QueuingService {

    let url: String

    public init(url: String) {
        self.url = url
    }

    public func send(queueId: QueueID, message: Data, completion: @escaping (Error?) -> Void) {
        let queueUrl = URL(string: "\(url)/\(queueId)")
        var request = URLRequest(url: queueUrl!)
        request.httpMethod = "POST"
        let task = URLSession.shared.uploadTask(with: request, from: message) { _, _, error in
            guard error == nil else {
                completion(error)
                return
            }
            completion(nil)
        }
        task.resume()
    }

    public func receive(queueId: QueueID) throws -> Data? {
        return nil
    }
}
