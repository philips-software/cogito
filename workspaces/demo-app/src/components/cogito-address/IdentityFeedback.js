import React, { Component } from 'react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { TimedErrorMessage, TelepathStatus } from 'components/telepath'

import { AppEventsActions } from 'app-events'

class IdentityFeedback extends Component {
  renderWithStore = ({ telepathError }, dispatch) => (
    <>
      <TelepathStatus>Reading identity...</TelepathStatus>
      <TimedErrorMessage
        error={telepathError}
        onTimeout={() => dispatch(AppEventsActions.telepathErrorClear())}
      />
    </>
  )

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

export { IdentityFeedback }
