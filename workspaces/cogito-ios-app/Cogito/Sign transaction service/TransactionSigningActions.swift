import ReSwiftThunk

struct TransactionSigningActions {
    // swiftlint:disable:next identifier_name
    static func Sign(tx: [String:Any],
                     responseId: JsonRpcId,
                     channel: TelepathChannel) -> ThunkAction<AppState> {
        return ThunkAction(action: { dispatch, getState in
            let builder = TransactionSignerBuilder(transaction: tx,
                                                   dispatch: dispatch,
                                                   getState: getState,
                                                   responseId: responseId,
                                                   channel: channel)
            builder.build().execute()
        })
    }
}
