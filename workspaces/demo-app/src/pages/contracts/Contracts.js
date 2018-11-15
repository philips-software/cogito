import React from 'react'
import { Demo } from 'components/ui/demo'
import { CogitoContract } from 'components/cogito-contract'

class Contracts extends React.Component {
  state = {}

  render () {
    const { match, location, history } = this.props
    return (
      <Demo routeProps={{ match, location, history }} subtitle='Executing Contracts' documentation='documentation/contracts.md'>
        <CogitoContract {...this.props} />
      </Demo>
    )
  }
}

export { Contracts }
