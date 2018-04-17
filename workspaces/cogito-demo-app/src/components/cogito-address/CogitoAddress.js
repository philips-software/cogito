import React from 'react'

import { WithStore } from 'app-state'
import { Centered, ValueWrapper } from 'components/layout'

export const CogitoAddress = () =>
  <WithStore
    selector={state => ({
      address: state.userData.account
    })}>
    {
      ({address}) =>
        <Centered>
          <p>Your Cogito account address is:</p>
          <ValueWrapper>{address || 'unknown'}</ValueWrapper>
        </Centered>
    }
  </WithStore>
