import React, { Component } from 'react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { TimedErrorMessage, TelepathStatus } from 'components/telepath'

import { AppEventsActions } from 'app-events'

class SimpleStorageFeedback extends Component {
  select = state => ({
    telepathError: state.appEvents.telepathError
  })

  renderWithStore = ({ telepathError }, dispatch) => (
    <>
      <TelepathStatus>Executing contract...</TelepathStatus>
      <TimedErrorMessage
        error={telepathError}
        onTimeout={() => dispatch(AppEventsActions.telepathErrorClear())}
      />
    </>
  )

  render () {
    return (
      <WithStore
        selector={this.select}
        render={this.renderWithStore}
      />
    )
  }
}

export { SimpleStorageFeedback }
