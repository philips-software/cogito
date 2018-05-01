import React from 'react'
import { Cogito } from '@cogitojs/cogito'

export class CogitoReact extends React.Component {
  state = { web3: null, channel: null, contracts: null }
  cogito

  constructor ({ contracts }) {
    super()
    this.cogito = new Cogito(contracts)
  }

  updateState = async (props) => {
    const { channelId, channelKey } = props

    let telepathKey

    if (channelKey instanceof Uint8Array || channelKey === undefined) {
      telepathKey = channelKey
    } else {
      telepathKey = Uint8Array.from(Object.values(channelKey))
    }

    const { web3, channel, contracts } = await this.cogito.update({ channelId, channelKey: telepathKey })

    this.setState({ web3, channel, contracts })

    this.props.onTelepathChanged && this.props.onTelepathChanged({
      channelId: channel.id,
      channelKey: channel.key
    })
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
