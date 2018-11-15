import React from 'react'
import { Demo } from 'components/ui/demo'
import { CogitoAttestations } from 'components/cogito-attestations'

class Attestations extends React.Component {
  state = {}

  render () {
    const { match, location, history } = this.props
    return (
      <Demo routeProps={{ match, location, history }} subtitle='Attestations' documentation='documentation/attestations.md'>
        <CogitoAttestations {...this.props} />
      </Demo>
    )
  }
}

export { Attestations }
