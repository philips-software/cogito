import React, { Component } from 'react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { ValueWrapper } from '@react-frontend-developer/react-layout-helpers'

class Balance extends Component {
  render () {
    return (
      <WithStore
        selector={state => ({
          balance: state.userData.balance
        })}
      >
        {
          ({ balance }, dispatch) => (
            <>
              <p>Current value is:</p>
              <ValueWrapper data-testid='current-value'>{balance}</ValueWrapper>
            </>
          )
        }
      </WithStore>
    )
  }
}

export { Balance }
