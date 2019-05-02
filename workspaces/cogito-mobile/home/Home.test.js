import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { Home } from './Home'
import { Navigation } from 'react-native-navigation'

describe('HomeScreen', () => {
  const welcomeText = 'Who am I?'

  it('shows the welcome text', () => {
    const { queryByText } = render(<Home />)
    expect(queryByText(welcomeText)).not.toBeNull()
  })

  it('navigates to the create identity screen', () => {
    const { getByText } = render(<Home />)
    fireEvent.press(getByText(welcomeText))

    const layout = Navigation.push.mock.calls[0][1]
    expect(layout.component.name).toEqual('CreateIdentity')
  })
})
