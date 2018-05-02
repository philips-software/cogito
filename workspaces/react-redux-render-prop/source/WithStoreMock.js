import React from 'react'

class WithStoreMock extends React.Component {
  dispatch = jest.fn()

  static mockStore = state => {
    WithStoreMock.state = state
  }

  select () {
    return this.props.selector(WithStoreMock.state)
  }

  render () {
    const { render, children } = this.props

    return render ? render(this.select(), this.dispatch) : children(this.select(), this.dispatch)
  }
}

export { WithStoreMock }
