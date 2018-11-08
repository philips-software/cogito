public struct Transaction {
    public var to: Address?
    public var gasLimit: BigInteger?
    public var gasPrice: BigInteger?
    public var nonce: BigInteger?
    public var data: Data?
    public var value: BigInteger?
    public var chainId: BigInteger?

    public init(
        to: Address? = nil,
        gasLimit: BigInteger? = nil,
        gasPrice: BigInteger? = nil,
        nonce: BigInteger? = nil,
        data: Data? = nil,
        value: BigInteger? = nil,
        chainId: BigInteger? = nil
    ) {
        self.to = to
        self.gasLimit = gasLimit
        self.gasPrice = gasPrice
        self.nonce = nonce
        self.data = data
        self.value = value
        self.chainId = chainId
    }

    public var asDictionary: Dictionary<String, Any?> {
        return [
            "to": to,
            "gasLimit": gasLimit,
            "gasPrice": gasPrice,
            "nonce": nonce,
            "data": data?.asHex,
            "value": value,
            "chainId": chainId
        ]
    }
}

public typealias Address = String
public typealias BigInteger = String

