import { AppEventsActions } from 'app-events'
import { UserDataActions } from 'user-data'

import { CogitoIdentity } from '@cogitojs/cogito-identity'

const getAccount = async (dispatch, channel) => {
  const requestedProperties = [
    CogitoIdentity.Property.EthereumAddress,
    CogitoIdentity.Property.Username
  ]
  const cogitoIdentity = new CogitoIdentity({ channel })
  const info = await cogitoIdentity.getInfo({ properties: requestedProperties })
  if (!info) throw new Error('No identity found on the mobile device!')
  dispatch(UserDataActions.setIdentityInfo(info))
  dispatch(UserDataActions.connectionEstablished())
}

class IdentityActions {
  static read = ({ channel }) => {
    return async dispatch => {
      dispatch(AppEventsActions.telepathInProgress())
      try {
        await getAccount(dispatch, channel)
        dispatch(AppEventsActions.telepathFulfilled())
      } catch (error) {
        console.error(error)
        dispatch(AppEventsActions.telepathError({ reason: error.message }))
      }
    }
  }
}

export { IdentityActions }
