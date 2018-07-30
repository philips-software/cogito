import React from 'react'
import { Demo } from 'components/ui/demo'
import { CogitoStreamEncryption } from 'components/cogito-crypto'

class StreamEncryption extends React.Component {
  state = {}

  render () {
    const { match, location, history } = this.props
    return (
      <Demo routeProps={{match, location, history}} subtitle='Stream Encryption' documentation='documentation/stream-encryption.md'>
        <CogitoStreamEncryption {...this.props} />
      </Demo>
    )
  }
}

export { StreamEncryption }
