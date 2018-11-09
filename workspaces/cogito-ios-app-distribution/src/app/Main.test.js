import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import { Main } from './Main'

it('renders without crashing', async () => {
  const div = document.createElement('div')
  await ReactDOM.render(<Main />, div)
})

it('renders correctly', async () => {
  const app = await renderer
    .create(<Main />)
  expect(app.toJSON()).toMatchSnapshot()
})
