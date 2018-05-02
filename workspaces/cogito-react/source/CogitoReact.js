import React from 'react'
import { Cogito } from '@cogitojs/cogito'

export class CogitoReact extends React.Component {
  state = { web3: null, channel: null, contracts: null }
  cogito

  constructor ({ contracts }) {
    super()
    this.cogito = new Cogito(contracts)
  }

  normalizeKey = key => {
    if (key instanceof Uint8Array || key === undefined) {
      return key
    } else {
      return Uint8Array.from(Object.values(key))
    }
  }

  updateState = async (props) => {
    const { channelId, channelKey } = props

    const telepathKey = this.normalizeKey(channelKey)

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

  componentDidUpdate (prevProps, prevState) {
    const prevKey = this.normalizeKey(prevProps.channelKey)
    const currentKey = this.normalizeKey(this.props.channelKey)
    if (prevProps.channelId !== this.props.channelId ||
      prevKey.toString() !== currentKey.toString()) {
      this.updateState(this.props)
    }
  }

  render () {
    return this.props.render
      ? this.props.render(this.state)
      : this.props.children(this.state)
  }
}
