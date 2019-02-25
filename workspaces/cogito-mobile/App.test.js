import React from 'react'
import { render } from 'react-native-testing-library'
import App from './App'

it('show the home screen by default', () => {
  const { queryByText } = render(<App />)
  expect(queryByText('I am.')).not.toBeNull()
})
