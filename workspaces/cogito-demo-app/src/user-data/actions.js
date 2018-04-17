class UserDataActions {
  static connectionEstablished = () => ({
    type: 'CONNECTION_ESTABLISHED'
  })

  static setAccount = account => ({
    type: 'SET_USER_ACCOUNT',
    account
  })

  static setTelepath = ({channelId, channelKey}) => ({
    type: 'SET_TELEPATH',
    channelId,
    channelKey
  })

  static setBalance = balance => ({
    type: 'SET_BALANCE',
    balance
  })
}

export { UserDataActions }
