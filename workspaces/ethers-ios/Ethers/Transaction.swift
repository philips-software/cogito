public struct Transaction {
    public var to: Address?
    public init(
        to: Address? = nil
    ) {
        self.to = to
    }

    public var asDictionary: Dictionary<String, Any?> {
        return [
            "to": to
        ]
    }
}

public typealias Address = String
