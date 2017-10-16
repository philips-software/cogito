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
            completion(self.checkValidity(response: response, error: error))
        }
        task.resume()
    }

    public func receive(queueId: QueueID, completion: @escaping (Data?, Error?) -> Void) {
        let queueUrl = URL(string: "\(url)/\(queueId)")!
        let task = URLSession.shared.dataTask(with: queueUrl) { data, response, error in
            if let failure = self.checkValidity(response: response, error: error) {
                completion(nil, failure)
            } else {
                completion(data, nil)
            }
        }
        task.resume()
    }

    private func checkValidity(response: URLResponse?, error: Error?) -> Failure? {
        guard error == nil else {
            return Failure.connectionError(cause: error!)
        }
        guard let response = response as? HTTPURLResponse else {
            return Failure.invalidResponse
        }
        guard 200..<300 ~= response.statusCode else {
            return Failure.httpError(statusCode: response.statusCode)
        }
        return nil
    }

    public enum Failure: Error {
        case connectionError(cause: Error)
        case invalidResponse
        case httpError(statusCode: Int)
    }
}
