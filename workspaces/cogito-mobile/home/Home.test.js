import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { Home } from './Home'
import { CreateIdentity } from '../identity-manager/CreateIdentity'
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

    const layout = Navigation.showModal.mock.calls[0][0]
    expect(layout).toEqual(CreateIdentity.modalPresentationLayout)
  })
})
