class AppEventsActions {
  static accountsFetchingInProgress = () => ({
    type: 'ACCOUNTS_FETCHING_IN_PROGRESS'
  })

  static accountsFetchingFulfilled = () => ({
    type: 'ACCOUNTS_FETCHING_FULFILLED'
  })

  static executingContractInProgress = () => ({
    type: 'EXECUTING_CONTRACT_IN_PROGRESS'
  })

  static executingContractError = () => ({
    type: 'EXECUTING_CONTRACT_ERROR'
  })

  static executingContractFulfilled = () => ({
    type: 'EXECUTING_CONTRACT_FULFILLED'
  })
}

export { AppEventsActions }
