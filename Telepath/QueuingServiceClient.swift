//Copyright © 2017 Philips. All rights reserved.

public struct QueuingServiceClient: QueuingService {

    let url: URL

    public init(url: URL) {
        self.url = url
    }

    public func send(queueId: QueueID, message: Data, completion: @escaping (Error?) -> Void) {
        let encodedMessage = message.base64urlEncodedString().data(using: .utf8)
        let queueUrl = url.appendingPathComponent(queueId)
        var request = URLRequest(url: queueUrl)
        request.httpMethod = "POST"
        let task = URLSession.shared.uploadTask(with: request, from: encodedMessage) { _, response, error in
            completion(self.checkValidity(response: response, error: error))
        }
        task.resume()
    }

    public func receive(queueId: QueueID, completion: @escaping (Data?, Error?) -> Void) {
        let queueUrl = url.appendingPathComponent(queueId)
        let task = URLSession.shared.dataTask(with: queueUrl) { data, response, error in
            let (message, error) = self.extractMessage(response: response, data: data, error: error)
            completion(message, error)
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

    private func extractMessage(response: URLResponse?, data: Data?, error: Error?) -> (Data?, Error?) {
        if let error = checkValidity(response: response, error: error) {
            return (nil, error)
        }
        if (response as? HTTPURLResponse)?.statusCode == 204 {
            return (nil, nil)
        }
        if
            let data = data,
            let base64 = String(data: data, encoding: .utf8),
            let message = Data(base64urlEncoded: base64)
        {
            return (message, nil)
        }
        return (nil, Failure.invalidResponse)
    }

    public enum Failure: Error {
        case connectionError(cause: Error)
        case invalidResponse
        case httpError(statusCode: Int)
    }
}
