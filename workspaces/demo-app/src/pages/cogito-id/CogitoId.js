import React from 'react'
import { Demo } from 'components/ui/demo'
import { CogitoAddress } from 'components/cogito-address'

class CogitoId extends React.Component {
  state = {}

  render () {
    const { match, location, history } = this.props
    return (
      <Demo routeProps={{match, location, history}} subtitle='Identity' documentation='documentation/cogito-id.md'>
        <CogitoAddress {...this.props} />
      </Demo>
    )
  }
}

export { CogitoId }
