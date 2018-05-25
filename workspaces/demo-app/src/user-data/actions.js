class UserDataActions {
  static connectionEstablished = () => ({
    type: 'CONNECTION_ESTABLISHED'
  })

  static setAccount = account => ({
    type: 'SET_USER_ACCOUNT',
    account
  })

  static setTelepath = ({channelId, channelKey, appName}) => ({
    type: 'SET_TELEPATH',
    channelId,
    channelKey,
    appName
  })

  static setBalance = balance => ({
    type: 'SET_BALANCE',
    balance
  })
}

export { UserDataActions }
