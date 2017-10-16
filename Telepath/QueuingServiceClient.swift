//Copyright © 2017 Philips. All rights reserved.

public struct QueuingServiceClient: QueuingService {

    let url: String

    public init(url: String) {
        self.url = url
    }

    public func send(queueId: QueueID, message: Data, completion: @escaping (Error?) -> Void) {
        let queueUrl = URL(string: "\(url)/\(queueId)")!
        var request = URLRequest(url: queueUrl)
        request.httpMethod = "POST"
        let task = URLSession.shared.uploadTask(with: request, from: message) { _, response, error in
            guard error == nil else {
                completion(Failure.connectionError(cause: error!))
                return
            }
            guard let response = response as? HTTPURLResponse else {
                completion(Failure.invalidResponse)
                return
            }
            guard 200..<300 ~= response.statusCode else {
                completion(Failure.httpError(statusCode: response.statusCode))
                return
            }
            completion(nil)
        }
        task.resume()
    }

    public func receive(queueId: QueueID, completion: @escaping (Data?, Error?) -> Void) {
        let queueUrl = URL(string: "\(url)/\(queueId)")!
        let task = URLSession.shared.dataTask(with: queueUrl) { data, _, _ in
            completion(data, nil)
        }
        task.resume()
    }

    public enum Failure: Error {
        case connectionError(cause: Error)
        case invalidResponse
        case httpError(statusCode: Int)
    }
}
