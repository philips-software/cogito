import React from 'react'
import { PropTypes } from 'prop-types'

import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { Centered } from '@react-frontend-developer/react-layout-helpers'

import { SimpleStorageBalance } from './SimpleStorageBalance'
import { SimpleStorageControls } from './SimpleStorageControls'
import { SimpleStorageFeedback } from './SimpleStorageFeedback'

class CogitoContract extends React.Component {
  unmounting = false
  state = {}

  static propTypes = {
    telepathChannel: PropTypes.object,
    SimpleStorage: PropTypes.func,
    newChannel: PropTypes.func
  }

  setContract = async () => {
    const { SimpleStorage } = this.props
    const simpleStorage = await SimpleStorage.deployed()
    !this.unmounting && this.setState({ simpleStorage })
  }

  componentDidMount () {
    this.setContract()
  }

  async componentDidUpdate (prevProps) {
    if (prevProps.SimpleStorage !== this.props.SimpleStorage) {
      this.setContract()
    }
  }

  componentWillUnmount () {
    this.unmounting = true
  }

  contractReady = () => {
    return this.state.simpleStorage
  }

  renderWithStore = (_, dispatch) => {
    if (this.contractReady()) {
      const { simpleStorage } = this.state
      const { telepathChannel, newChannel } = this.props

      return (
        <Centered>
          <SimpleStorageBalance simpleStorage={simpleStorage} dispatch={dispatch} />
          <SimpleStorageControls simpleStorage={simpleStorage} telepathChannel={telepathChannel} newChannel={newChannel} />
          <SimpleStorageFeedback />
        </Centered>
      )
    } else {
      return null
    }
  }

  render () {
    return (
      <WithStore
        selector={() => ({})}
        render={this.renderWithStore}
      />
    )
  }
}

export { CogitoContract }
