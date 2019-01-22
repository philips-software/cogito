import React, { Component } from 'react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import {
  ValueWrapper,
  Spacer
} from '@react-frontend-developer/react-layout-helpers'

class Identity extends Component {
  renderWithStore = ({ address, username }) => (
    <>
      <p>Your Cogito account address is:</p>
      <ValueWrapper data-testid='current-address'>{address || 'unknown'}</ValueWrapper>
      <Spacer margin='20px 0 0 0' />
      <p>You are known as:</p>
      <ValueWrapper data-testid='current-username'>{username || 'unknown'}</ValueWrapper>
    </>
  )

  select = state => ({
    address: state.userData.ethereumAddress,
    username: state.userData.username
  })

  render () {
    return (
      <WithStore
        selector={this.select}
        render={this.renderWithStore}
      />
    )
  }
}

export { Identity }
