import React from 'react'
import PropTypes from 'prop-types'
import { Cogito } from '@cogitojs/cogito'
import { PropValidator } from './PropValidator'

export class CogitoReact extends React.Component {
  state
  cogito

  static propTypes = {
    channelId: PropTypes.string,
    channelKey: function (props, propName, componentName) {
      const prop = props[propName]

      const validator = new PropValidator(prop, propName)

      try {
        validator.validate()
      } catch (e) {
        return e
      }
    }
  }

  constructor ({ contracts }) {
    super()
    this.cogito = new Cogito(contracts)
    this.state = { web3: null, channel: null, contracts: null, newChannel: this.newChannel }
  }

  normalizeKey = key => {
    if (key instanceof Uint8Array || key === undefined) {
      return key
    } else {
      return Uint8Array.from(Object.values(key))
    }
  }

  newChannel = async () => {
    const { appName } = this.props
    return this.updateState({
      channelId: undefined,
      channelKey: undefined,
      appName
    })
  }

  updateState = async (props) => {
    const { channelId, channelKey, appName } = props

    const telepathKey = this.normalizeKey(channelKey)

    const { web3, channel, contracts } = await this.cogito.update({
      channelId,
      channelKey: telepathKey,
      appName
    })

    this.setState({ web3, channel, contracts })

    this.props.onTelepathChanged && this.props.onTelepathChanged({
      channelId: channel.id,
      channelKey: channel.key,
      appName: channel.appName
    })
  }

  componentDidMount () {
    this.updateState(this.props)
  }

  componentDidUpdate (prevProps, prevState) {
    const prevKey = this.normalizeKey(prevProps.channelKey) || ''
    const currentKey = this.normalizeKey(this.props.channelKey) || ''
    if (prevProps.channelId !== this.props.channelId ||
      prevKey.toString() !== currentKey.toString() ||
      prevProps.appName !== this.props.appName) {
      this.updateState(this.props)
    }
  }

  render () {
    return this.props.render
      ? this.props.render(this.state)
      : this.props.children(this.state)
  }
}
