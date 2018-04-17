import React from 'react'

class WithStore extends React.Component {
  dispatch = jest.fn()

  static mockStore = state => {
    WithStore.state = state
  }

  select () {
    return this.props.selector(WithStore.state)
  }

  render () {
    return this.props.render(this.select(), this.dispatch)
  }
}

export { WithStore }
