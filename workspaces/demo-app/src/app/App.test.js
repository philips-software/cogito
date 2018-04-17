import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { App } from './App'

jest.mock('components/web3/ReactWeb3')

it('renders without crashing', async () => {
  const div = document.createElement('div')
  await ReactDOM.render(<App />, div)
})

it('renders correctly', async () => {
  const app = await renderer
    .create(<App />)
  expect(app.toJSON()).toMatchSnapshot()
})
