import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Navigation } from 'react-native-navigation'
import { CurrentIdentityComponent } from './CurrentIdentity'
import { CreateIdentity } from '../identity-manager/CreateIdentity'

describe('CurrentIdentityComponent', () => {
  const welcomeText = 'Who am I?'

  it('shows the welcome text', () => {
    const { queryByText } = render(<CurrentIdentityComponent />)
    expect(queryByText(welcomeText)).not.toBeNull()
  })

  it('shows the identity name in props if available', () => {
    const { queryByText } = render(<CurrentIdentityComponent identityName='superman' />)

    expect(queryByText(welcomeText)).toBeNull()
    expect(queryByText('superman')).not.toBeNull()
  })

  it('navigates to the create identity screen', () => {
    const { getByText } = render(<CurrentIdentityComponent />)
    fireEvent.press(getByText(welcomeText))

    const layout = Navigation.showModal.mock.calls[0][0]
    expect(layout).toEqual(CreateIdentity.modalPresentationLayout)
  })

  it('does not navigate to create identity screen when identity is present', () => {
    const identityName = 'my identity'
    const { getByText } = render(<CurrentIdentityComponent identityName={identityName} />)

    const element = getByText(identityName)
    fireEvent.press(element)
    expect(Navigation.showModal).not.toBeCalled()
  })
})
