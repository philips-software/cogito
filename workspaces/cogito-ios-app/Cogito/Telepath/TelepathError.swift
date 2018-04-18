// © KONINKLIJKE PHILIPS N.V., 2018
// All rights are reserved. Reproduction in whole or in part is prohibited without the prior
// written consent of the copyright holder.
//
// This source code and any compilation or derivative thereof is the proprietary information
// of KONINKLIJKE PHILIPS N.V. and is confidential in nature. Under no circumstances is this
// software to be combined with any Open Source Software in any way or placed under an Open
// Source License of any type without the express written permission of KONINKLIJKE PHILIPS N.V.

protocol TelepathError: Error {
    var code: Int { get }
    var message: String { get }
}

enum SignTransactionError: Int, TelepathError {
    case invalidTransaction = 1000
    case signingFailed
    case userRejected

    var code: Int { return self.rawValue }

    var message: String {
        switch self {
        case .invalidTransaction: return "missing or invalid field(s) in transaction data"
        case .signingFailed: return "could not sign the transaction"
        case .userRejected: return "user rejected signing request"
        }
    }
}

enum AttestationError: Int, TelepathError {
    case invalidRealmUrl = 2000
    case invalidConfiguration
    case userDeniedAccess
    case userCancelledLogin

    var code: Int { return self.rawValue }

    var message: String {
        switch self {
        case .invalidRealmUrl: return "invalid realm URL"
        case .invalidConfiguration: return "invalid configuration"
        case .userDeniedAccess: return "user denied access"
        case .userCancelledLogin: return "user cancelled login"
        }
    }
}

enum EncryptionError: Int, TelepathError {
    case tagMissing = 3000
    case keyNotFound
    case cipherTextMissing
    case cipherTextInvalid
    case decryptionFailed

    var code: Int { return self.rawValue }

    var message: String {
        switch self {
        case .tagMissing: return "request parameter 'tag' is missing"
        case .keyNotFound: return "no key with requested tag is found"
        case .cipherTextMissing: return "request parameter 'cipherText' is missing"
        case .cipherTextInvalid: return "request parameter 'cipherText' is not a valid hex string"
        case .decryptionFailed: return "unable to decrypt"
        }
    }
}
