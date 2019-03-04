import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { Home } from './Home'
import { Navigation } from 'react-native-navigation'

it('navigates to the identity manager', () => {
  const { getByText } = render(<Home />)
  fireEvent.press(getByText('I am.'))
  const layout = Navigation.push.mock.calls[0][1]
  expect(layout.component.name).toEqual('IdentityManager')
})
