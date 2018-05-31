extension ProtoAttestation: CustomStringConvertible {
    public var description: String {
        let serialize = Javascript.cogitoAttestations.forProperty("serialize")!
        let serialized = serialize.call(withArguments: [javascriptValue])!
        return serialized.toString()
    }

    public convenience init(_ serialized: String) {
        let deserialize = Javascript.cogitoAttestations.forProperty("deserialize")!
        let deserialized = deserialize.call(withArguments: [serialized])!
        self.init(javascriptValue: deserialized)
    }
}
