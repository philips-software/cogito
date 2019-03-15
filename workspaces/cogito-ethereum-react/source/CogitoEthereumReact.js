import React from 'react'
import PropTypes from 'prop-types'
import { CogitoEthereum } from '@cogitojs/cogito-ethereum'
import { PropValidator } from './PropValidator'

export class CogitoEthereumReact extends React.Component {
  state
  cogitoEthereum

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
    },
    appName: PropTypes.string.isRequired,
    contractsBlobs: PropTypes.arrayOf(PropTypes.object).isRequired,
    onTelepathChanged: PropTypes.func,
    onConnectionStatusChanged: PropTypes.func,
    render: PropTypes.func
  }

  constructor ({ contractsBlobs }) {
    super()
    this.cogitoEthereum = new CogitoEthereum(contractsBlobs)
    this.state = {
      cogitoWeb3: null,
      telepathChannel: null,
      contractsProxies: null,
      newChannel: this.newChannel
    }
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

  notify = (connected, logMessage) => {
    const { onConnectionStatusChanged } = this.props
    onConnectionStatusChanged && onConnectionStatusChanged({ connected })
    console.log(logMessage)
  }

  notifyTelepathChanged = ({ telepathChannel }) => {
    this.props.onTelepathChanged && this.props.onTelepathChanged({
      channelId: telepathChannel.id,
      channelKey: telepathChannel.key,
      appName: telepathChannel.appName
    })
  }

  disconnectFromCurrentProvider = () => {
    if (this.provider) {
      this.provider.on('end', () => {})
      this.provider.connection && this.provider.connection.close()
    }
  }

  setCurrentProvider = context => {
    this.disconnectFromCurrentProvider()
    this.provider = context.cogitoWeb3.currentProvider.provider
  }

  monitorProvider = context => {
    this.setCurrentProvider(context)
    this.watchFor('connect', context)
  }

  onConnectionLost = async e => {
    this.notify(false, '[WS END] Lost connection to web3')
    this.interval = setInterval(async () => {
      console.log('reconnecting to web3...')
      const context = await this.getContextFromState()
      this.monitorProvider(context)
    }, 2000)
  }

  watchFor = (event, context) => {
    if (event === 'end') {
      this.provider.on('end', this.onConnectionLost)
    } else if (event === 'connect') {
      this.provider.on('connect', () => {
        this.notify(true, '[WS CONNECT] Restored connection to web3')
        this.setState(context)
        this.provider.on('end', this.onConnectionLost)
        clearInterval(this.interval)
      })
    }
  }

  getContextFromProps = props => {
    const { channelId, channelKey, appName } = props

    const telepathKey = this.normalizeKey(channelKey)

    return this.cogitoEthereum.getContext({
      channelId,
      channelKey: telepathKey,
      appName
    })
  }

  getContextFromState = props => {
    return this.cogitoEthereum.getContext({
      channelId: this.state.telepathChannel.id,
      channelKey: this.state.telepathChannel.key,
      appName: this.state.telepathChannel.appName
    })
  }

  updateState = async (props) => {
    const context = await this.getContextFromProps(props)

    this.setState(context)
    this.setCurrentProvider(context)
    this.watchFor('end')
    this.notifyTelepathChanged(context)
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
    return currentProps.channelId !== prevState.telepathChannel.id ||
      currentProps.channelKey !== prevState.telepathChannel.key ||
      currentProps.appName !== prevState.telepathChannel.appName
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

  componentWillUnmount () {
    this.disconnectFromCurrentProvider()
    this.interval && clearInterval(this.interval)
  }

  render () {
    return this.props.render
      ? this.props.render(this.state)
      : this.props.children(this.state)
  }
}
