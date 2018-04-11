//Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

struct ExampleError: Error {
    let message: String
}

extension ExampleError: Equatable {
    static func == (lhs: ExampleError, rhs: ExampleError) -> Bool {
        return lhs.message == rhs.message
    }
}
