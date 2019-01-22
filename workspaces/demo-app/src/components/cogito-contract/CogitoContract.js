import React from 'react'
import { PropTypes } from 'prop-types'

import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { Centered } from '@react-frontend-developer/react-layout-helpers'
import { AppEventsActions } from 'app-events'
import { TelepathError, TelepathStatus } from 'components/telepath'

import { SimpleStorageBalance } from './SimpleStorageBalance'
import { SimpleStorageControls } from './SimpleStorageControls'

class CogitoContract extends React.Component {
  static propTypes = {
    telepathChannel: PropTypes.object,
    SimpleStorage: PropTypes.func,
    newChannel: PropTypes.func
  }

  renderWithStore = ({ telepathError }, dispatch) => {
    const { SimpleStorage, telepathChannel, newChannel } = this.props
    return (
      <Centered>
        <SimpleStorageBalance telepathChannel={telepathChannel} contractProxy={SimpleStorage} dispatch={dispatch} />
        <SimpleStorageControls key={telepathChannel.id} contractProxy={SimpleStorage} telepathChannel={telepathChannel} newChannel={newChannel} />
        <TelepathStatus>Executing contract...</TelepathStatus>
        <TelepathError
          error={telepathError}
          onTimeout={() => dispatch(AppEventsActions.telepathErrorClear())}
        />
      </Centered>
    )
  }

  select = state => ({
    telepathError: state.appEvents.telepathError
  })

  render () {
    return (
      <WithStore
        selector={this.select}
        render={this.renderWithStore}
      />
    )
  }
}

export { CogitoContract }
