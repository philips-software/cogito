const initialState = {
  connectionEstablished: false,
  balance: 0
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_ACCOUNT':
      return {
        ...state,
        account: action.account
      }
    case 'CONNECTION_ESTABLISHED':
      return {
        ...state,
        connectionEstablished: true
      }
    case 'CLEAR_CONNECTION_ESTABLISHED':
      return {
        ...state,
        connectionEstablished: false
      }
    case 'SET_TELEPATH':
      return {
        ...state,
        channelId: action.channelId,
        channelKey: action.channelKey,
        appName: action.appName
      }
    case 'SET_BALANCE':
      return {
        ...state,
        balance: action.balance
      }
    case 'SET_IDENTITY_INFO':
      return {
        ...state,
        ethereumAddress: action.info.ethereumAddress,
        username: action.info.username
      }
    default:
      return state
  }
}

export default reducer
