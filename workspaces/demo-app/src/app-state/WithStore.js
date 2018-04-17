import React from 'react'
import { store } from './store'

class WithStore extends React.Component {
  constructor (props) {
    super()
    const state = store.getState()
    const dprops = props.selector(state)
    this.state = {
      ...dprops
    }
  }

  componentDidMount () {
    this.unsubscribe = store.subscribe(() => {
      if (this.unmounted) return
      const state = store.getState()
      const props = this.props.selector(state)
      this.setState({
        ...props
      })
    })
    this.unmounted = false
  }

  componentWillUnmount () {
    this.unmounted = true
    this.unsubscribe()
  }

  render () {
    const { render, children } = this.props

    return render ? render(this.state, store.dispatch) : children(this.state, store.dispatch)
  }
}

export { WithStore }
