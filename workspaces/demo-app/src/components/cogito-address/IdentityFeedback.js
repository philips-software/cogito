import React, { Component } from 'react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { TelepathError, TelepathStatus } from 'components/telepath'

import { AppEventsActions } from 'app-events'

class IdentityFeedback extends Component {
  select = state => ({
    telepathError: state.appEvents.telepathError
  })

  renderWithStore = ({ telepathError }, dispatch) => (
    <>
      <TelepathStatus>Reading identity...</TelepathStatus>
      <TelepathError
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

export { IdentityFeedback }
