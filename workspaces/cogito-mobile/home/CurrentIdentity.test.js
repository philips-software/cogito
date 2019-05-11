import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { CurrentIdentity } from './CurrentIdentity'
import { Navigation } from 'react-native-navigation'
import { CreateIdentity } from '../identity-manager/CreateIdentity'

describe('CurrentIdentity', () => {
  const welcomeText = 'Who am I?'

  it('shows the welcome text', () => {
    const { queryByText } = render(<CurrentIdentity />)
    expect(queryByText(welcomeText)).not.toBeNull()
  })

  it('navigates to the create identity screen', () => {
    const { getByText } = render(<CurrentIdentity />)
    fireEvent.press(getByText(welcomeText))

    const layout = Navigation.showModal.mock.calls[0][0]
    expect(layout).toEqual(CreateIdentity.modalPresentationLayout)
  })
})
