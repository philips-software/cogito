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

  static telepathInProgress = () => ({
    type: 'TELEPATH_IN_PROGRESS'
  })

  static telepathFulfilled = () => ({
    type: 'TELEPATH_FULFILLED'
  })

  static telepathError = obj => ({
    type: 'TELEPATH_ERROR',
    reason: (obj && obj.reason) || 'error'
  })

  static telepathErrorClear = () => ({
    type: 'TELEPATH_ERROR_CLEAR'
  })

  static executingContractFulfilled = () => ({
    type: 'EXECUTING_CONTRACT_FULFILLED'
  })

  static setDialogOpen = () => ({
    type: 'DIALOG_OPEN'
  })

  static setDialogClosed = () => ({
    type: 'DIALOG_CLOSED'
  })
}

export { AppEventsActions }
