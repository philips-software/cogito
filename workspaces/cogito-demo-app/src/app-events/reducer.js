const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'ACCOUNTS_FETCHING_IN_PROGRESS':
      return {
        ...state,
        accountsFetchingInProgress: true
      }
    case 'ACCOUNTS_FETCHING_FULFILLED':
      return {
        ...state,
        accountsFetchingInProgress: false
      }
    case 'EXECUTING_CONTRACT_IN_PROGRESS':
      return {
        ...state,
        executingContractInProgress: true
      }
    case 'EXECUTING_CONTRACT_ERROR':
      return {
        ...state,
        executingContractInProgress: 'error'
      }
    case 'EXECUTING_CONTRACT_FULFILLED':
      return {
        ...state,
        executingContractInProgress: false
      }
    default:
      return state
  }
}

export default reducer
