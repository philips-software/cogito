import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { Navigation } from 'react-native-navigation'
import { CurrentIdentityComponent, CurrentIdentity } from './CurrentIdentity'
import { CreateIdentity } from '../identity-manager/CreateIdentity'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import '../enzyme.config'

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
    expect(() => fireEvent.press(element)).toThrow('No handler function found for event: press')
  })
})

describe('CurrentIdentity', () => {
  it('maps the state to the props', () => {
    const mockStore = configureMockStore()
    const name = 'This is my name'
    const store = mockStore({
      identity: {
        name
      }
    })

    const wrapper = shallow(<CurrentIdentity store={store} />)

    // Note: I'm not convinced this is the correct way of verifying the props that are passed
    const props = wrapper.props().children.props
    expect(props.identityName).toBe(name)
  })
})
