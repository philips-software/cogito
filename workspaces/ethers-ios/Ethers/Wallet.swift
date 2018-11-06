public class Wallet {
    public let address: String = "0x1234"

    public static func createRandom() -> Wallet {
        return Wallet()
    }
}
