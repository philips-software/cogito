//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Foundation
import UIKit

let nonceLength = 32

protocol URLOpening {
    func canOpenURL(_ url: URL) -> Bool
    func open(_ url: URL,
              options: [String : Any],
              completionHandler completion: ((Bool) -> Swift.Void)?)
}

extension UIApplication: URLOpening {}

struct OpenIDAttestationStarter {
    let oidcRealmUrl: URL
    let onSuccess: (Nonce) -> Void
    let onError: (Nonce, String) -> Void
    let nonce: Nonce
    let urlOpener: URLOpening

    init(oidcRealmUrl: URL,
         onSuccess: @escaping (Nonce) -> Void,
         onError: @escaping (Nonce, String) -> Void,
         urlOpener: URLOpening = UIApplication.shared) {
        self.oidcRealmUrl = oidcRealmUrl
        self.onSuccess = onSuccess
        self.onError = onError
        self.urlOpener = urlOpener

        var bytes = [UInt8](repeating: 0, count: nonceLength)
        let result = SecRandomCopyBytes(kSecRandomDefault, nonceLength, &bytes)
        guard result == errSecSuccess else {
            print("SecRandomCopyBytes give error: \(result)")
            abort()
        }
        nonce = Data(bytes: bytes).hexEncodedString()
    }

    func run() {
        withOpenIdConfiguration { maybeConfig, error in
            if let config = maybeConfig,
               let url = self.implicitFlowUrl(openIdConfiguration: config),
               self.urlOpener.canOpenURL(url) {
                self.urlOpener.open(url, options: [:]) { success in
                    if success {
                        self.onSuccess(self.nonce)
                    } else {
                        self.onError(self.nonce, "failed to open browser for OpenID Connect authorization")
                    }
                }
            } else {
                self.onError(self.nonce, error ?? "failed to initiate OpenID Connect authorization")
            }
         }
    }

    func implicitFlowUrl(openIdConfiguration: [String:Any]) -> URL? {
        guard let baseUrl = openIdConfiguration["authorization_endpoint"] as? String,
              var urlComponents = URLComponents(string: baseUrl) else {
            return nil
        }
        urlComponents.queryItems = [
            URLQueryItem(name: "response_type", value: "id_token"),
            URLQueryItem(name: "client_id", value: "cogito"),
            URLQueryItem(name: "redirect_uri", value: Configuration.openIdCallbackUrl),
            URLQueryItem(name: "scope", value: "openid"),
            URLQueryItem(name: "nonce", value: nonce)
        ]
        return urlComponents.url
    }

    func withOpenIdConfiguration(completion: @escaping ([String: Any]?, String?) -> Void) {
        let configUrl = oidcRealmUrl
            .appendingPathComponent(".well-known", isDirectory: true)
            .appendingPathComponent("openid-configuration", isDirectory: false)
        let task = URLSession.shared.dataTask(with: configUrl) { data, _, error in
            DispatchQueue.main.async {
                if let data = data {
                    do {
                        if let config = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                            completion(config, nil)
                            return
                        }
                    } catch {}
                }

                let unspecificError = "failed to retrieve OpenID configuration; incorrect server URL?"
                let errorMessage = error?.localizedDescription ?? unspecificError
                completion(nil, errorMessage)
            }
        }
        task.resume()
    }
}
