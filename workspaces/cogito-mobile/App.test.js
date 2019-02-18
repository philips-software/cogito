import React from 'react'
import { render } from 'react-native-testing-library'
import App from './App'

it('shows the home screen by default', () => {
    const { getByText } = render(<App/>)
    expect(getByText('I am.')).toBeDefined
})