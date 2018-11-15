import React from 'react'
import { Demo } from 'components/ui/demo'
import { CogitoSimpleEncryption } from 'components/cogito-crypto'

class SimpleEncryption extends React.Component {
  state = {}

  render () {
    const { match, location, history } = this.props
    return (
      <Demo routeProps={{ match, location, history }} subtitle='Simple Encryption' documentation='documentation/simple-encryption.md'>
        <CogitoSimpleEncryption {...this.props} />
      </Demo>
    )
  }
}

export { SimpleEncryption }
