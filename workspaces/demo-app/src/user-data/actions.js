import { CogitoIdentity } from '@cogitojs/cogito-identity'

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

  static getIdentityInfo = (channel) => {
    const requestedProperties = [
      CogitoIdentity.Property.EthereumAddress,
      CogitoIdentity.Property.Username
    ]
    return async (dispatch) => {
      const cogitoIdentity = new CogitoIdentity({ channel })
      const info = await cogitoIdentity.getInfo({ properties: requestedProperties })
      if (info && info.ethereumAddress) {
        dispatch(UserDataActions.connectionEstablished())
      }
      dispatch(UserDataActions.setIdentityInfo(info))
    }
  }

  static setIdentityInfo = info => ({
    type: 'SET_IDENTITY_INFO',
    info
  })
}

export { UserDataActions }
