//  Copyright © 2017 Konkinklijke Philips Nederland N.V. All rights reserved.

struct KeyStoreState: Codable {
    var keyStore: KeyStore?

    enum CodingKeys: String, CodingKey {
        case keyStore
        case keyStoreType
    }

    init(keyStore: KeyStore?) {
        self.keyStore = keyStore
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let keyStoreType = try container.decode(String.self, forKey: .keyStoreType)
        if keyStoreType == "GethKeyStoreWrapper" {
            keyStore = try container.decode(Optional<GethKeyStoreWrapper>.self, forKey: .keyStore)
        } else {
            keyStore = try container.decode(Optional<KeyStore>.self, forKey: .keyStore)
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(keyStore, forKey: .keyStore)
        if keyStore as? GethKeyStoreWrapper != nil {
            try container.encode("GethKeyStoreWrapper", forKey: .keyStoreType)
        } else {
            try container.encode("KeyStore", forKey: .keyStoreType)
        }
    }
}

let initialKeyStoreState = KeyStoreState(keyStore: nil)
