import React from 'react'
import simpleStorage from 'contracts/SimpleStorage.json'
import { CogitoWeb3 } from 'services/web3'

import { UserDataActions } from 'user-data'

const contractsInfo = {
  deployedContractsInfo: [
    { contractName: 'simpleStorage', contractDefinition: simpleStorage }
  ],
  rawContractsInfo: []
}

export class ReactWeb3 extends React.Component {
  state = { web3: null, channel: null, contracts: null }
  cogitoWeb3 = new CogitoWeb3(contractsInfo)

  updateState = async (props) => {
    const { channelId, channelKey } = props

    let telepathKey

    if (channelKey instanceof Uint8Array || channelKey === undefined) {
      telepathKey = channelKey
    } else {
      telepathKey = Uint8Array.from(Object.values(channelKey))
    }

    const { web3, channel, contracts } = await this.cogitoWeb3.update({ channelId, channelKey: telepathKey })

    this.setState({ web3, channel, contracts })

    props.dispatch(UserDataActions.setTelepath({
      channelId: channel.id,
      channelKey: channel.key
    }))
  }

  componentDidMount () {
    this.updateState(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.channelId !== this.props.channelId ||
      nextProps.channelKey !== this.props.channelKey) {
      this.updateState(nextProps)
    }
  }

  render () {
    return this.props.render
      ? this.props.render(this.state)
      : this.props.children(this.state)
  }
}
