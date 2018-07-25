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
    case 'DIALOG_OPEN':
      return {
        ...state,
        dialogOpen: true
      }
    case 'DIALOG_CLOSED':
      return {
        ...state,
        dialogOpen: false
      }
    case 'TELEPATH_IN_PROGRESS':
      return {
        ...state,
        telepathInProgress: true
      }
    case 'TELEPATH_ERROR':
      return {
        ...state,
        telepathInProgress: false,
        telepathError: action.reason || 'error'
      }
    case 'TELEPATH_ERROR_CLEAR':
      return {
        ...state,
        telepathError: undefined
      }
    case 'TELEPATH_FULFILLED':
      return {
        ...state,
        telepathInProgress: false
      }
    default:
      return state
  }
}

export default reducer
