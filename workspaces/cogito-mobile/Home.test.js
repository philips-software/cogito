import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { Home } from './Home'
import { IdentityManager } from './IdentityManager'

it('navigates to the identity manager', () => {
    const navigator = { push: jest.fn() }
    const { getByText } = render(<Home navigator={navigator}/>)
    fireEvent.press(getByText('I am.'))
    expect(navigator.push).toBeCalledWith(IdentityManager.route)
})
