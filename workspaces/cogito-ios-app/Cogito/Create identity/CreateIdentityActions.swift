import ReSwift
import ReSwiftThunk

// In this file we disable SwiftLint `identifier_name`, because we don't want
// to make a syntactic difference between normal actions and thunks; from the
// outside it doesn't matter which it is.
// swiftlint:disable identifier_name

struct CreateIdentityActions {
    struct ResetForm: Action {}

    struct SetDescription: Action {
        let description: String
    }

    static func CreateIdentity() -> ThunkAction<AppState> {
        return ThunkAction(action: { (dispatch, getState) in
            dispatch(Pending())
            guard let state = getState(),
                  let keyStore = state.keyStore.keyStore else {
                dispatch(Rejected(message: "key store not found"))
                return
            }
            keyStore.newAccount { (address, error) in
                guard let address = address else {
                    dispatch(Rejected(message: error ?? "failed to create account"))
                    return
                }
                dispatch(DiamondActions.CreateFacet(
                    description: state.createIdentity.description,
                    address: address
                ))
                dispatch(Fulfilled(address: address))
            }
        })
    }

    struct Pending: Action {}
    struct Rejected: Action {
        let message: String
    }
    struct Fulfilled: Action {
        let address: Address
    }
}
