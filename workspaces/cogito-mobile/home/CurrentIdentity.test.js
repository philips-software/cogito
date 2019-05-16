import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { CurrentIdentityComponent as CurrentIdentity } from './CurrentIdentity'
import { Navigation } from 'react-native-navigation'
import { CreateIdentity } from '../identity-manager/CreateIdentity'

describe('CurrentIdentity', () => {
  const welcomeText = 'Who am I?'

  it('shows the welcome text', () => {
    const { queryByText } = render(<CurrentIdentity />)
    expect(queryByText(welcomeText)).not.toBeNull()
  })

  it('shows the identity name in props if available', () => {
    const { queryByText } = render(<CurrentIdentity identityName='superman' />)
    expect(queryByText(welcomeText)).toBeNull()
    expect(queryByText('superman')).not.toBeNull()
  })

  it('navigates to the create identity screen', () => {
    const { getByText } = render(<CurrentIdentity />)
    fireEvent.press(getByText(welcomeText))

    const layout = Navigation.showModal.mock.calls[0][0]
    expect(layout).toEqual(CreateIdentity.modalPresentationLayout)
  })
})