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

  normalize = data => {
    const channelKey = this.normalizeKey(data.channelKey) || ''
    return { ...data, channelKey }
  }

  propsChanged = (prevProps, currentProps) => {
    return prevProps.channelId !== currentProps.channelId ||
      prevProps.channelKey.toString() !== currentProps.channelKey.toString() ||
      prevProps.appName !== currentProps.appName
  }

  currentPropsDifferentFromPrevState = (currentProps, prevState) => {
    return currentProps.channelId !== prevState.channel.id ||
      currentProps.channelKey !== prevState.channel.key ||
      currentProps.appName !== prevState.channel.appName
  }

  componentDidMount () {
    this.updateState(this.props)
  }

  componentDidUpdate (prevProps, prevState) {
    const normalizedPrevProps = this.normalize(prevProps)
    const normalizedCurrentProps = this.normalize(this.props)
    if (this.propsChanged(normalizedPrevProps, normalizedCurrentProps) &&
        this.currentPropsDifferentFromPrevState(normalizedCurrentProps, prevState)) {
      this.updateState(this.props)
    }
  }

  render () {
    return this.props.render
      ? this.props.render(this.state)
      : this.props.children(this.state)
  }
}
