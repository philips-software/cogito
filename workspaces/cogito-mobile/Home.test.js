import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import { Home } from './Home'

it('navigates to the identity manager', () => {
  const navigation = { navigate: jest.fn() }
  const { getByText } = render(<Home navigation={navigation} />)
  fireEvent.press(getByText('I am.'))
  expect(navigation.navigate).toBeCalledWith('IdentityManager')
})
