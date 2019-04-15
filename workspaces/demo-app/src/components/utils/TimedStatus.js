import React from 'react'

class TimedStatus extends React.Component {
  constructor () {
    super()
    this.state = { timedOut: false }
  }

  componentDidMount () {
    this.timer = setTimeout(() => {
      this.setState({ timedOut: true })
      this.props.onTimeout()
    }, this.props.timeout)
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
  }

  render () {
    return this.state.timedOut
      ? this.props.renderOnTimeout
        ? this.props.renderOnTimeout()
        : null
      : this.props.children
  }
}

export { TimedStatus }
